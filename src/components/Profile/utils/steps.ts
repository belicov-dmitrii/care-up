import { type FormFields } from '@/components/Forms/FormElement';
import { registrationValidationSchema } from '@/components/Registration/utils/registrationValidationSchema';
import { SEX_OPTIONS } from '@/components/Registration/utils/steps';
import { type UserData } from '@/types';

export type UserToSend = Omit<UserData, 'id' | 'email'>;

export const profileSteps: FormFields<keyof UserToSend> = [
    [
        { name: 'sex', type: 'select', label: 'Sex at birth', options: SEX_OPTIONS },
        { name: 'age', type: 'text', label: 'Age', endAdornment: 'yrs' },
    ],
    [
        { name: 'height', type: 'text', label: 'Height', endAdornment: 'cm' },
        { name: 'weight', type: 'text', label: 'Weight', endAdornment: 'kg' },
    ],
    { name: 'pregnant', type: 'toggle', label: 'Pregnant' },
    { name: 'breastfeeding', type: 'toggle', label: 'Breastfeeding' },
    { name: 'smoking', type: 'toggle', label: 'Smoking' },
    { name: 'drinking', type: 'toggle', label: 'Drinking' },
    { name: 'allergies', type: 'custom', label: 'Allergies' },
    { name: 'diseases', type: 'custom', label: 'Chronic diseases' },
];

export const profileSchema = registrationValidationSchema.omit([
    'password',
    'confirmPassword',
    'email',
]);
