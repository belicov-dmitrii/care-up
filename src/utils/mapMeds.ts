import { type Med } from '@/types';

export const mapMeds = (meds: Array<Med>) => {
    return meds.reduce(
        (acc, med) => {
            acc[med.id] = med;
            return acc;
        },
        {} as Record<string, Med>
    );
};
