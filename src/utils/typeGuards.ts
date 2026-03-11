import { type IntakeEvent, type SymptomsType } from '@/types';
import { Symptoms } from './consts';

const allowedStatuses: IntakeEvent['status'][] = ['taken', 'missed', 'skipped'];

export const isObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const isValidSymptoms = (value: unknown): value is Array<SymptomsType> => {
    return Array.isArray(value) && value.every((item) => Symptoms.includes(item as SymptomsType));
};

export const isValidStatus = (value: unknown): value is IntakeEvent['status'] => {
    return typeof value === 'string' && allowedStatuses.includes(value as IntakeEvent['status']);
};
