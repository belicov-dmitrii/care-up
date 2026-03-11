import { type Med, type ScheduleItem } from '@/types';

export const addMedsToScheduleItems = (schedules: Array<ScheduleItem>, meds: Array<Med>) => {
    const medToObj = meds.reduce(
        (acc, med) => {
            return {
                ...acc,
                [med.id]: med,
            };
        },
        {} as Record<string, Med>
    );

    return schedules.map((schedule) => {
        return {
            ...schedule,
            med: medToObj[schedule.medId],
        };
    });
};
