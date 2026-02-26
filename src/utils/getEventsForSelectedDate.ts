import { ScheduleItem } from '@/types';
import moment from 'moment';
import { DATE_FORMAT } from './consts';

export enum ScheduleType {
    EveryDay = 'every day',
    EveryOtherDay = 'every other day',
    EveryWeek = 'every week',
    EveryMonth = 'every month',
    SpecificDate = 'specific date',
}

export type DashboardItemType = Omit<ScheduleItem, 'time'> &
    Record<'hours' | 'minutes', number> & { timeId: string };

const isValidHM = (h: number, m: number) =>
    Number.isInteger(h) && Number.isInteger(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59;

function scheduleOccursOnDate(schedule: ScheduleItem, selected: moment.Moment): boolean {
    const start = moment(schedule.startDate, 'YYYY-MM-DD', true).startOf('day');
    if (!start.isValid()) return false;

    const end = schedule.endDate
        ? moment(schedule.endDate, 'YYYY-MM-DD', true).startOf('day')
        : null;

    if (end && !end.isValid()) return false;

    const inRange =
        selected.isSameOrAfter(start, 'day') && (!end || selected.isSameOrBefore(end, 'day'));

    if (!inRange) return false;

    switch (schedule.type) {
        case ScheduleType.EveryDay:
            return true;

        case ScheduleType.EveryOtherDay: {
            const diffDays = selected.diff(start, 'days'); // 0 on start day
            return diffDays >= 0 && diffDays % 2 === 0;
        }

        case ScheduleType.EveryWeek: {
            const diffDays = selected.diff(start, 'days');
            return diffDays >= 0 && diffDays % 7 === 0;
        }

        case ScheduleType.EveryMonth:
            // same day-of-month as startDate; months without that day -> no occurrence
            return selected.date() === start.date() && selected.isSameOrAfter(start, 'day');

        case ScheduleType.SpecificDate:
            // interpret startDate as the only valid date
            return selected.isSame(start, 'day');

        default:
            return false;
    }
}

export function getEventsForSelectedDate(
    schedules: ScheduleItem[],
    dateStr: string
): DashboardItemType[] {
    const selected = moment(dateStr, DATE_FORMAT, true).startOf('day');
    if (!selected.isValid()) return [];

    const events: DashboardItemType[] = [];

    for (const schedule of schedules || []) {
        if (!schedule || !Array.isArray(schedule.time)) continue;

        if (!scheduleOccursOnDate(schedule, selected)) continue;

        const { time, ...scheduleToCopy } = schedule;

        for (const t of time) {
            if (!t || !isValidHM(t.hours, t.minutes)) continue;

            events.push({
                ...scheduleToCopy,
                timeId: t.id,
                hours: t.hours,
                minutes: t.minutes,
            });
        }
    }

    // sort by time, then by medId for stable ordering
    events.sort(
        (a, b) => a.hours - b.hours || a.minutes - b.minutes || a.medId.localeCompare(b.medId)
    );

    return events;
}
