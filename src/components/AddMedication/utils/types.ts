import { type Dispatch, type SetStateAction } from 'react';
import { type Med } from '@/types';
import { type Moment } from 'moment';

export interface IAddMedicationChildProps {
    medData: Partial<Med>;
    setStep: Dispatch<SetStateAction<AddMedicationStepChooser>>;
    changeMedData: (newMedData: Partial<Med>) => void;
    closeMedicationDrawer: () => void;
}

export type NewMedType = Omit<Med, 'userId' | 'expirationDate' | 'id' | 'quantity' | 'name'> & {
    expirationDate: Moment | null;
    medName: string;
};
export enum AddMedicationStepChooser {
    AddMedication,
    PhotoAdding,
    ManualAdding,
    CreateSchedule
}
