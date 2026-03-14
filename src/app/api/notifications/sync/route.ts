import { promises as fs } from 'fs';
import path from 'path';
import moment from 'moment';
import { type NextRequest, NextResponse } from 'next/server';
import { getUserDataByToken } from '@/utils/getUserDataByToken';
import { AUTH_COOKIE_NAME } from '../../login/route';
import { type ScheduleTime, type NotificationJob, type ScheduleItem, type Med } from '@/types';
import { addMedsToScheduleItems } from '@/utils/addMedsToScheduleItems';
import { DATE_FORMAT } from '@/utils/consts';
import { encodeIdWithDate } from '@/utils/eventsEncoder';

type ScheduleItemWithMed = ScheduleItem & { med: Med };

const DATA_DIR = path.join(process.cwd(), 'data');
const SCHEDULES_FILE = path.join(DATA_DIR, 'schedule.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');
const MEDS_FILE = path.join(DATA_DIR, 'meds.json');

export const APP_TIMEZONE_OFFSET = '+02:00';
const DAYS_AHEAD = 4;

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
    try {
        const raw = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function isScheduleActiveOnDate(schedule: ScheduleItemWithMed, targetDate: string): boolean {
    const start = moment(schedule.startDate, 'YYYY-MM-DD', true);
    const target = moment(targetDate, 'YYYY-MM-DD', true);

    if (!start.isValid() || !target.isValid()) return false;
    if (target.isBefore(start, 'day')) return false;

    if (schedule.endDate) {
        const end = moment(schedule.endDate, 'YYYY-MM-DD', true);
        if (!end.isValid()) return false;
        if (target.isAfter(end, 'day')) return false;
    }

    switch (schedule.type) {
        case 'every day':
            return true;

        case 'every other day': {
            const diff = target.clone().startOf('day').diff(start.clone().startOf('day'), 'days');
            return diff % 2 === 0;
        }

        case 'every week': {
            const diff = target.clone().startOf('day').diff(start.clone().startOf('day'), 'days');
            return diff % 7 === 0;
        }

        case 'every month':
            return target.date() === start.date();

        case 'specific date':
            return target.format('YYYY-MM-DD') === start.format('YYYY-MM-DD');

        default:
            return false;
    }
}

function buildJobId(
    schedule: ScheduleItemWithMed,
    scheduleTimeId: string,
    targetDate: string,
    kind: NotificationJob['kind'],
    restrictionType?: string
): string {
    if (restrictionType) {
        return `${schedule.id}:${scheduleTimeId}:${targetDate}:${kind}:${restrictionType}`;
    }

    return `${schedule.id}:${scheduleTimeId}:${targetDate}:${kind}`;
}

function buildIntakeBody(schedule: ScheduleItemWithMed, scheduleTimeId: string): string {
    const dose = schedule.dose?.[scheduleTimeId];

    if (dose != null) {
        return `Take ${schedule?.med?.name} — dose: ${dose} ${schedule.med.form}`;
    }

    return `Take ${schedule?.med?.name || 'medication'}`;
}

function buildJobsForScheduleTime(
    schedule: ScheduleItemWithMed,
    scheduleTime: ScheduleTime,
    targetDate: string
): NotificationJob[] {
    const intakeAt = moment(
        `${targetDate} ${String(scheduleTime.hours).padStart(2, '0')}:${String(scheduleTime.minutes).padStart(2, '0')}:00${APP_TIMEZONE_OFFSET}`,
        'YYYY-MM-DD HH:mm:ssZ',
        true
    );

    if (!intakeAt.isValid()) return [];

    const dose = schedule.dose?.[scheduleTime.id];
    const jobs: NotificationJob[] = [];

    const url = `/dashboard/${encodeIdWithDate(`${schedule.id}${scheduleTime.id}`, moment(targetDate).format(DATE_FORMAT))}`;

    jobs.push({
        url,
        id: buildJobId(schedule, scheduleTime.id, targetDate, 'intake'),
        userId: schedule.userId,
        medId: schedule.medId,
        scheduleId: schedule.id,
        timeId: scheduleTime.id,
        kind: 'intake',
        title: 'Medication reminder',
        body: buildIntakeBody(schedule, scheduleTime.id),
        sendAtLocal: intakeAt.format('YYYY-MM-DDTHH:mm:ss'),
        sendAtUTC: intakeAt.clone().utc().toISOString(),
        oneSignalNotificationId: null,
        status: 'pending',
        meta: {
            dose,
        },
    });

    for (const restriction of schedule.restriction ?? []) {
        if (!restriction.enabled) continue;

        if (restriction.before != null) {
            const beforeAt = intakeAt.clone().subtract(restriction.before, 'minutes');

            jobs.push({
                url,
                id: buildJobId(
                    schedule,
                    scheduleTime.id,
                    targetDate,
                    'restriction-before',
                    restriction.type
                ),
                userId: schedule.userId,
                medId: schedule.medId,
                scheduleId: schedule.id,
                timeId: scheduleTime.id,
                kind: 'restriction-before',
                title: 'Medication reminder',
                body: `${schedule?.med?.name}: ${restriction.note}`,
                sendAtLocal: beforeAt.format('YYYY-MM-DDTHH:mm:ss'),
                sendAtUTC: beforeAt.clone().utc().toISOString(),
                oneSignalNotificationId: null,
                status: 'pending',
                meta: {
                    restrictionType: restriction.type,
                    restrictionNote: restriction.note,
                    dose,
                },
            });
        }

        if (restriction.after != null) {
            const afterAt = intakeAt.clone().add(restriction.after, 'minutes');

            jobs.push({
                url,
                id: buildJobId(
                    schedule,
                    scheduleTime.id,
                    targetDate,
                    'restriction-after',
                    restriction.type
                ),
                userId: schedule.userId,
                medId: schedule.medId,
                scheduleId: schedule.id,
                timeId: scheduleTime.id,
                kind: 'restriction-after',
                title: 'Medication reminder',
                body: `${schedule?.med?.name}: ${restriction.note}`,
                sendAtLocal: afterAt.format('YYYY-MM-DDTHH:mm:ss'),
                sendAtUTC: afterAt.clone().utc().toISOString(),
                oneSignalNotificationId: null,
                status: 'pending',
                meta: {
                    restrictionType: restriction.type,
                    restrictionNote: restriction.note,
                    dose,
                },
            });
        }
    }

    return jobs.sort((a, b) => a.sendAtUTC.localeCompare(b.sendAtUTC));
}

function buildNotificationJobsForWindow(
    schedules: ScheduleItemWithMed[],
    daysAhead = DAYS_AHEAD
): NotificationJob[] {
    const now = moment().utcOffset(APP_TIMEZONE_OFFSET);
    const allJobs: NotificationJob[] = [];

    for (const schedule of schedules) {
        for (let i = 0; i < daysAhead; i++) {
            const targetDate = now.clone().add(i, 'days').format('YYYY-MM-DD');

            if (!isScheduleActiveOnDate(schedule, targetDate)) continue;

            for (const scheduleTime of schedule.time ?? []) {
                const jobs = buildJobsForScheduleTime(schedule, scheduleTime, targetDate);
                allJobs.push(...jobs);
            }
        }
    }

    return allJobs
        .filter((job) => moment(job.sendAtUTC).isAfter(moment.utc()))
        .sort((a, b) => a.sendAtUTC.localeCompare(b.sendAtUTC));
}

type NotificationGroup = {
    key: string;
    userId: string;
    sendAtUTC: string;
    jobs: NotificationJob[];
};

function groupJobsForOneSignal(jobs: NotificationJob[]): NotificationGroup[] {
    const groupsMap = new Map<string, NotificationGroup>();

    for (const job of jobs) {
        const key = `${job.userId}:${job.sendAtUTC}`;

        if (!groupsMap.has(key)) {
            groupsMap.set(key, {
                key,
                userId: job.userId,
                sendAtUTC: job.sendAtUTC,
                jobs: [],
            });
        }

        groupsMap.get(key)!.jobs.push(job);
    }

    return Array.from(groupsMap.values()).sort((a, b) => a.sendAtUTC.localeCompare(b.sendAtUTC));
}

function buildGroupedNotificationPayload(group: NotificationGroup) {
    const jobs = group.jobs;

    if (jobs.length === 1) {
        const job = jobs[0];

        return {
            title: job.title,
            body: job.body,
            url: job.url,
            data: {
                notificationJobIds: [job.id],
                scheduleIds: [job.scheduleId],
                timeIds: [job.timeId],
                kinds: [job.kind],
                medIds: [job.medId],
                grouped: false,
            },
        };
    }

    const intakeJobs = jobs.filter((job) => job.kind === 'intake');
    const beforeJobs = jobs.filter((job) => job.kind === 'restriction-before');
    const afterJobs = jobs.filter((job) => job.kind === 'restriction-after');

    const lines: string[] = [];

    if (intakeJobs.length) {
        lines.push(...intakeJobs.map((job) => `• ${job.body}`));
    }

    if (beforeJobs.length) {
        lines.push(...beforeJobs.map((job) => `• ${job.body}`));
    }

    if (afterJobs.length) {
        lines.push(...afterJobs.map((job) => `• ${job.body}`));
    }

    return {
        title: `Medication reminders (${jobs.length})`,
        body: lines.join('\n').slice(0, 1800),
        url: jobs[0].url,
        data: {
            notificationJobIds: jobs.map((job) => job.id),
            scheduleIds: jobs.map((job) => job.scheduleId),
            timeIds: jobs.map((job) => job.timeId),
            kinds: jobs.map((job) => job.kind),
            medIds: jobs.map((job) => job.medId),
            grouped: true,
        },
    };
}

async function sendNotificationGroupToOneSignal(group: NotificationGroup) {
    const appId = process.env.ONESIGNAL_APP_ID;
    const apiKey = process.env.ONESIGNAL_REST_API_KEY;

    if (!appId || !apiKey) {
        throw new Error('Missing ONESIGNAL_APP_ID or ONESIGNAL_REST_API_KEY');
    }

    const payload = buildGroupedNotificationPayload(group);

    const response = await fetch('https://api.onesignal.com/notifications?c=push', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Key ${apiKey}`,
        },
        body: JSON.stringify({
            app_id: appId,
            include_aliases: {
                external_id: [group.userId],
            },
            target_channel: 'push',
            headings: {
                en: payload.title,
            },
            contents: {
                en: payload.body,
            },
            url: payload.url,
            web_url: payload.url,
            send_after: group.sendAtUTC,
            data: payload.data,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`OneSignal error ${response.status}: ${JSON.stringify(data)}`);
    }

    return data;
}

export async function POST(req: NextRequest) {
    try {
        const userId = (await getUserDataByToken(req.cookies.get(AUTH_COOKIE_NAME)?.value))?.id;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const schedules = await readJsonFile<ScheduleItem[]>(SCHEDULES_FILE, []);
        const meds = await readJsonFile<Med[]>(MEDS_FILE, []);
        const notifications = await readJsonFile<NotificationJob[]>(NOTIFICATIONS_FILE, []);

        const userSchedules = schedules.filter((schedule) => schedule.userId === userId);

        const userSchedulesWithMeds: ScheduleItemWithMed[] = addMedsToScheduleItems(
            userSchedules,
            meds
        );

        const candidateJobs = buildNotificationJobsForWindow(userSchedulesWithMeds, DAYS_AHEAD);

        const existingJobsMap = new Map<string, NotificationJob>(
            notifications.map((job) => [job.id, job])
        );

        const newJobs: NotificationJob[] = [];
        const skippedJobs: NotificationJob[] = [];

        for (const candidateJob of candidateJobs) {
            const existing = existingJobsMap.get(candidateJob.id);

            if (existing) {
                skippedJobs.push(existing);
                continue;
            }

            newJobs.push(candidateJob);
        }

        const groups = groupJobsForOneSignal(newJobs);

        const createdJobs: NotificationJob[] = [];

        for (const group of groups) {
            try {
                const oneSignalResult = await sendNotificationGroupToOneSignal(group);
                const oneSignalNotificationId =
                    typeof oneSignalResult?.id === 'string' ? oneSignalResult.id : null;

                for (const job of group.jobs) {
                    createdJobs.push({
                        ...job,
                        oneSignalNotificationId,
                        status: 'scheduled',
                    });
                }
            } catch {
                for (const job of group.jobs) {
                    createdJobs.push({
                        ...job,
                        status: 'failed',
                    });
                }
            }
        }

        const nextNotifications = [...notifications, ...createdJobs];
        await writeJsonFile(NOTIFICATIONS_FILE, nextNotifications);

        return NextResponse.json({
            ok: true,
            userId,
            schedulesCount: userSchedules.length,
            candidateJobsCount: candidateJobs.length,
            newJobsCount: newJobs.length,
            groupedRequestsCount: groups.length,
            createdJobsCount: createdJobs.length,
            skippedJobsCount: skippedJobs.length,
            createdJobs,
            skippedJobs,
        });
    } catch (error) {
        return NextResponse.json(
            {
                ok: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
