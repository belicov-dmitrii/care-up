import { AddMedicationByPhoto } from '../AddMedicationByPhoto';
import { AddMedicationCreateSchedule } from '../AddMedicationCreateSchedule';
import { AddMedicationManual } from '../AddMedicationManual';
import { PhotoOrManual } from '../PhotoOrManual';

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
    {
        title: 'Create Schedule',
        content: AddMedicationCreateSchedule,
    },
] as const;
