import { ScheduleType, type IntakeEvent, type SymptomsType } from '@/types';
import { Symptoms } from './consts';
import { enumToOptions } from '@/components/Forms/utils/enumToOptions';

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

export const isValidCreateScheduleBody = (
    candidate: Record<string, unknown | unknown[]>
): boolean => {
    if (!Array.isArray(candidate.time)) return false;

    const timeIds = candidate.time?.map((t) => t.id);

    return (
        typeof candidate.medId === 'string' &&
        typeof candidate.endDate === 'string' &&
        candidate.endDate !== 'Invalid date' &&
        enumToOptions(ScheduleType)
            .map((option) => option.display)
            .includes(candidate.type as ScheduleType) &&
        isObject(candidate.dose) &&
        Array.isArray(candidate.time) &&
        !!candidate.time.length &&
        Object.keys(candidate.dose).length === timeIds.length &&
        Object.keys(candidate.dose).every((key) => timeIds?.includes(key)) &&
        Object.values(candidate.dose).every((d) => !!Number(d))
    );
};
