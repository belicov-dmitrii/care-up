import { type Dispatch, type SetStateAction } from 'react';
import { type AddMedicationStepChooser } from './steps';
import { type Med } from '@/types';
import { type Moment } from 'moment';

export interface IAddMedicationChildProps {
    medData: Partial<Med>;
    setStep: Dispatch<SetStateAction<AddMedicationStepChooser>>;
    changeMedData: (newMedData: Partial<Med>) => void;
}

export type NewMedType = Omit<Med, 'userId' | 'expirationDate' | 'id' | 'quantity' | 'name'> & {
    expirationDate: Moment | null;
    medName: string;
};
