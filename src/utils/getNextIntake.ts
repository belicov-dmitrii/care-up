import { type IntakeEvent } from '@/types';
import { type DashboardItemWithMedType } from './sortAndFilterMeds';
import moment from 'moment';
import { DATE_FORMAT } from './consts';
import { encodeIdWithDate } from './eventsEncoder';

export const getNextIntake = (
    todaySchedules: DashboardItemWithMedType[],
    todayEvents: Record<string, IntakeEvent>
) => {
    return todaySchedules.find((schedule) => {
        const id = encodeIdWithDate(schedule.scheduleByTimeId, moment().format(DATE_FORMAT));

        return !todayEvents[id];
    });
};
