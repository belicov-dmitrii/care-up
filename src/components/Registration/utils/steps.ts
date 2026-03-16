import { type FormFields } from '@/components/Forms/FormElement';
import { type NewUserDataType } from './types';

export const SEX_OPTIONS = [
    {
        value: 'M',
        display: 'Man',
    },
    {
        value: 'F',
        display: 'Woman',
    },
];

export const registrationSteps: Array<FormFields<keyof NewUserDataType>> = [
    [{ name: 'name', type: 'text', label: 'Name' }],
    [
        { name: 'email', type: 'text', label: 'Email' },
        { name: 'password', type: 'password', label: 'Password' },
        { name: 'confirmPassword', type: 'password', label: 'Confirm Password' },
    ],
    [
        { name: 'sex', type: 'select', label: 'Sex at birth', options: SEX_OPTIONS },
        { name: 'height', type: 'text', label: 'Height', endAdornment: 'cm' },
        { name: 'age', type: 'text', label: 'Age', endAdornment: 'yrs' },
        { name: 'weight', type: 'text', label: 'Weight', endAdornment: 'kg' },
    ],
    [
        { name: 'pregnant', type: 'toggle', label: 'Pregnant' },
        { name: 'breastfeeding', type: 'toggle', label: 'Breastfeeding' },
        { name: 'smoking', type: 'toggle', label: 'Smoking' },
        { name: 'drinking', type: 'toggle', label: 'Drinking' },
    ],
    [
        { name: 'allergies', type: 'custom', label: 'Allergies' },
        { name: 'diseases', type: 'custom', label: 'Chronic diseases' },
    ],
];

export const registrationTitles = [
    {
        title: 'What should we call you?',
        subtitle: 'Your preferred name or nickname makes your daily reminders feel more personal.',
    },
    {
        title: "Now let's protect you data",
        subtitle: 'Please enter your email and create a strong password for your login',
    },
    {
        title: 'Let AI know you better',
        subtitle:
            'Please enter your sex at birth, age and body parameters, so AI can tailor the doses for you',
    },
    {
        title: 'Let CareUp know a bit of your habits',
        subtitle: "It's important so they or the medicine don't mess one with another",
    },
    {
        title: 'Last but not least',
        subtitle:
            'Please include any diagnoses or long-term conditions. This is an important part of knowing what AI might suggest you',
    },
];
