import { type Med } from '@/types';
import moment from 'moment';

export const addTrailingZero = (num: number) => {
    return num < 10 ? `0${num}` : `${num}`;
};

export const formatTime = (hours: number, minutes: number) => {
    return `${addTrailingZero(hours)}:${addTrailingZero(minutes)}`;
};

export const formatMedDose = (med: Med) => {
    return `${med.dose} ${med.form.slice(0, -1)}`.toLowerCase();
};

export const formatMedExpirationDate = (expirationDate: string | undefined) => {
    return expirationDate ? moment(expirationDate).format('MMM YYYY') : 'No Expiration Date';
};
