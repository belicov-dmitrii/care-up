import { type Med, MedStockStatus } from '@/types';
import { PALETTE } from './theme/colors';
import { DOT } from './consts';
import moment from 'moment';

export const getMedStockStatus = (
    remaining: number
): { stockLabel: string; stockColor: string } => {
    if (!remaining) return { stockLabel: MedStockStatus.Empty, stockColor: PALETTE.ERROR };

    if (remaining <= 20) {
        return { stockLabel: MedStockStatus.Expiring, stockColor: PALETTE.ERROR };
    } else if (remaining <= 40) {
        return { stockLabel: MedStockStatus.Low, stockColor: PALETTE.WARNING };
    } else {
        return { stockLabel: MedStockStatus.Good, stockColor: PALETTE.SUCCESS };
    }
};

export const getMedUnitDetails = (med: Med) => {
    return `${med.strength} ${med.unit} ${DOT} ${med.dose} ${med.form}`;
};

export const getMedRemainingTime = (expirationDate: string) => {
    const date = moment(expirationDate);
    const duration = moment.duration(date.diff(moment()));
    return duration.humanize();
};
