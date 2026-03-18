import {
    type Med,
    MedRemainingTime,
    MedStockStatus,
    type ScheduleItem,
    ScheduleType,
} from '@/types';
import { PALETTE } from './theme/colors';
import { DOT } from './consts';
import moment from 'moment';

export const getMedStockStatus = (
    remaining: number,
    remainingTime: string | MedRemainingTime
): { stockLabel: string; stockColor: string } => {
    if (!remaining || remainingTime === MedRemainingTime.Expired)
        return { stockLabel: MedStockStatus.Expired, stockColor: PALETTE.ERROR };

    if (remaining <= 20 || remainingTime === MedRemainingTime.Refill) {
        return { stockLabel: MedStockStatus.Expiring, stockColor: PALETTE.ERROR };
    } else if (remaining <= 40) {
        return { stockLabel: MedStockStatus.Low, stockColor: PALETTE.WARNING };
    } else {
        return { stockLabel: MedStockStatus.Good, stockColor: PALETTE.SUCCESS };
    }
};

export const getMedUnitDetails = (med: Med, includeDose = true) => {
    return `${med.strength} ${med.unit} ${DOT} ${includeDose ? med.dose : ''} ${med.form}`;
};

export const isDateExpired = (date: string | undefined) =>
    date ? moment(date).diff(moment(), 'days') < 0 : false;
export const isDateExpiring = (date: string | undefined) => {
    const diff = moment(date).diff(moment(), 'days');
    return date ? diff <= 30 && diff > 0 : false;
};

const daysIncrement = {
    [ScheduleType.EveryDay]: 1,
    [ScheduleType.EveryOtherDay]: 2,
    [ScheduleType.EveryWeek]: 7,
    [ScheduleType.EveryMonth]: 30,
};

export function getMedRemainingTime(med: Med, schedule: ScheduleItem | undefined) {
    if (!med.remaining && !isDateExpired(schedule?.endDate)) return MedRemainingTime.Refill;
    if (isDateExpired(med?.expirationDate)) return MedRemainingTime.Expired;
    if (
        schedule?.type === ScheduleType.SpecificDate ||
        isDateExpired(schedule?.endDate) ||
        !Array.isArray(schedule?.time)
    )
        return MedRemainingTime.AsNeeded;

    let remaining = med.remaining;
    let daysLeft = 0;
    const dose = Object.values(schedule.dose).reduce((acc, item) => acc + item, 0);

    while (remaining) {
        if (dose > remaining) {
            break;
        }

        remaining -= dose;
        daysLeft += daysIncrement[schedule.type];
    }

    daysLeft = daysLeft / schedule.time.length;

    if (daysLeft <= 7) return MedRemainingTime.Refill;

    return `~${moment.duration(daysLeft, 'days').humanize()}`;
}
