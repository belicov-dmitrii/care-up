import { promises as fs } from 'fs';
import path from 'path';
import moment from 'moment';
import { type NextRequest, NextResponse } from 'next/server';
import { getUserDataByToken } from '@/utils/getUserDataByToken';
import { AUTH_COOKIE_NAME } from '../../login/route';
import { type ScheduleTime, type NotificationJob, type ScheduleItem } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const SCHEDULES_FILE = path.join(DATA_DIR, 'schedules.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

const APP_TIMEZONE_OFFSET = '+02:00';

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

function isScheduleActiveOnDate(schedule: ScheduleItem, targetDate: string): boolean {
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
    schedule: ScheduleItem,
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

function buildIntakeBody(schedule: ScheduleItem, scheduleTimeId: string): string {
    const dose = schedule.dose?.[scheduleTimeId];

    if (dose != null) {
        return `Take medication — dose: ${dose}`;
    }

    return 'Take medication';
}

function buildJobsForScheduleTime(
    schedule: ScheduleItem,
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

    jobs.push({
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
                body: restriction.note,
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
                body: restriction.note,
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
    schedules: ScheduleItem[],
    daysAhead = 7
): NotificationJob[] {
    const today = moment().utcOffset(APP_TIMEZONE_OFFSET);
    const allJobs: NotificationJob[] = [];

    for (const schedule of schedules) {
        for (let i = 0; i < daysAhead; i++) {
            const targetDate = today.clone().add(i, 'days').format('YYYY-MM-DD');

            if (!isScheduleActiveOnDate(schedule, targetDate)) continue;

            for (const scheduleTime of schedule.time ?? []) {
                const jobs = buildJobsForScheduleTime(schedule, scheduleTime, targetDate);
                allJobs.push(...jobs);
            }
        }
    }

    return allJobs.sort((a, b) => a.sendAtUTC.localeCompare(b.sendAtUTC));
}

async function sendNotificationJobToOneSignal(job: NotificationJob) {
    const appId = process.env.ONESIGNAL_APP_ID;
    const apiKey = process.env.ONESIGNAL_REST_API_KEY;

    if (!appId || !apiKey) {
        throw new Error('Missing ONESIGNAL_APP_ID or ONESIGNAL_REST_API_KEY');
    }

    const response = await fetch('https://api.onesignal.com/notifications?c=push', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Key ${apiKey}`,
        },
        body: JSON.stringify({
            app_id: appId,
            include_aliases: {
                external_id: [job.userId],
            },
            target_channel: 'push',
            headings: {
                en: job.title,
            },
            contents: {
                en: job.body,
            },
            send_after: job.sendAtUTC,
            data: {
                notificationJobId: job.id,
                scheduleId: job.scheduleId,
                timeId: job.timeId,
                kind: job.kind,
                medId: job.medId,
            },
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
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        const schedules = await readJsonFile<ScheduleItem[]>(SCHEDULES_FILE, []);
        const notifications = await readJsonFile<NotificationJob[]>(NOTIFICATIONS_FILE, []);

        const userSchedules = schedules.filter((schedule) => schedule.userId === userId);
        const candidateJobs = buildNotificationJobsForWindow(userSchedules, 7);

        const existingJobsMap = new Map<string, NotificationJob>(
            notifications.map((job) => [job.id, job])
        );

        const createdJobs: NotificationJob[] = [];
        const skippedJobs: NotificationJob[] = [];

        for (const candidateJob of candidateJobs) {
            const existing = existingJobsMap.get(candidateJob.id);

            if (existing) {
                skippedJobs.push(existing);
                continue;
            }

            try {
                const oneSignalResult = await sendNotificationJobToOneSignal(candidateJob);

                const scheduledJob: NotificationJob = {
                    ...candidateJob,
                    oneSignalNotificationId:
                        typeof oneSignalResult?.id === 'string' ? oneSignalResult.id : null,
                    status: 'scheduled',
                };

                createdJobs.push(scheduledJob);
            } catch {
                const failedJob: NotificationJob = {
                    ...candidateJob,
                    status: 'failed',
                };

                createdJobs.push(failedJob);
            }
        }

        const nextNotifications = [...notifications, ...createdJobs];
        await writeJsonFile(NOTIFICATIONS_FILE, nextNotifications);

        return NextResponse.json({
            ok: true,
            userId,
            schedulesCount: userSchedules.length,
            candidateJobsCount: candidateJobs.length,
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
