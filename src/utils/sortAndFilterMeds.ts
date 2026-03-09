import { type ScheduleItem, type Med } from '@/types';
import {
    type DashboardItemType,
    getEventsForSelectedDate,
    splitScheduleByTime,
} from './getEventsForSelectedDate';
import moment from 'moment';
import { DATE_FORMAT } from './consts';

export type DashboardItemWithMedType = DashboardItemType & { med: Med };

export const addMedsToSchedule = (
    schedule: DashboardItemType[],
    meds: Med[]
): DashboardItemWithMedType[] => {
    const findMedById = (id: string) => {
        return meds.find((med) => med.id === id);
    };

    return schedule
        .map((schedule) => {
            return {
                ...schedule,
                med: findMedById(schedule.medId),
            };
        })
        .filter((schedule) => Boolean(schedule.med)) as DashboardItemWithMedType[];
};

export const sortByTimeOfDay = (schedule: DashboardItemWithMedType[], date: string) => {
    return {
        id: crypto.randomUUID(),
        date: date,
        morning: schedule.filter(({ hours }) => hours < 12),
        afternoon: schedule.filter(({ hours }) => hours < 18 && hours > 12),
        evening: schedule.filter(({ hours }) => hours > 18),
    };
};

export const getTodaySchedule = (
    meds: Med[],
    schedules: ScheduleItem[]
): DashboardItemWithMedType[] => {
    const formattedTodayDate = moment().format(DATE_FORMAT);
    const todaySchedules: ReturnType<typeof addMedsToSchedule> = addMedsToSchedule(
        getEventsForSelectedDate(schedules, formattedTodayDate),
        meds
    ).filter((schedule) => Boolean(schedule.med));

    return todaySchedules as DashboardItemWithMedType[];
};

export const getMedScheduleByScheduleId = (
    id: string,
    meds: Med[],
    schedules: ScheduleItem[]
): DashboardItemWithMedType | null => {
    if (!meds?.length || !schedules?.length) return null;

    const events: DashboardItemType[] = [];

    for (const schedule of schedules || []) {
        if (!schedule || !Array.isArray(schedule.time)) continue;

        events.push(...splitScheduleByTime(schedule));
    }

    const targetEvent = events.find((e) => e.scheduleByTimeId === id);

    if (!targetEvent) return null;

    const medSchedule = addMedsToSchedule([targetEvent], meds)[0];

    return medSchedule;
};

export const getScheduleByMedId = (id: string, schedules: ScheduleItem[]): ScheduleItem | null => {
    if (!schedules?.length) return null;

    return schedules.find((schedule) => schedule.medId === id) || null;
};
