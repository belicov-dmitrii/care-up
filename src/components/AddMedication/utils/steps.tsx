import { type FormFields } from '@/components/Forms/FormElement';
import { AddMedicationByPhoto } from '../AddMedicationByPhoto';
import { AddMedicationManual } from '../AddMedicationManual';
import { PhotoOrManual } from '../PhotoOrManual';
import { enumToOptions } from '@/components/Forms/utils/enumToOptions';
import { MedForm, MedUnit } from '@/types';
import { type NewMedType } from './types';

export const AddMedicationSteps = [
    {
        title: 'Add Medication',
        content: PhotoOrManual,
    },
    {
        title: 'Photo Adding',
        content: AddMedicationByPhoto,
    },
    {
        title: 'Manual Adding',
        content: AddMedicationManual,
    },
] as const;

export enum AddMedicationStepChooser {
    AddMedication,
    PhotoAdding,
    ManualAdding,
}

export const addMedicationManualSteps: Array<FormFields<keyof NewMedType>> = [
    [
        { name: 'medName', type: 'text', label: 'Name', autoFillName: 'med name' },
        {
            name: 'form',
            type: 'select',
            label: 'Form',
            options: enumToOptions(MedForm),
        },
    ],
    [
        [
            { name: 'strength', type: 'text', label: 'Strength' },
            { name: 'unit', type: 'select', options: enumToOptions(MedUnit), label: 'Unit' },
        ],
    ],
    [{ name: 'remaining', type: 'text', label: 'Quantity' }],
    [{ name: 'expirationDate', type: 'custom', label: 'Expiration Date' }],
];

export const addMedicationManualStepsTitles = [
    'Basic Info',
    'Form of Medications',
    'Inventory',
    'Expiration & Safety',
];
