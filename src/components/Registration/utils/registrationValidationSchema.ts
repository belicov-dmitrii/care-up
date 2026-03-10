import { numberField } from '@/utils/validation';
import * as Yup from 'yup';

export const registrationValidationSchema = Yup.object({
    name: Yup.string().trim().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
        .min(5, 'Password must be at least 5 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm your password'),
    sex: Yup.mixed<'M' | 'F'>().oneOf(['M', 'F']).required('Sex is required'),
    age: numberField().min(0).max(120).required('Age is required'),
    height: numberField().min(50).max(250).required('Height is required'),
    weight: numberField().min(20).max(300).required('Weight is required'),
    pregnant: Yup.boolean().when('sex', {
        is: 'M',
        then: (schema) => schema.oneOf([false], 'Male cannot be pregnant'),
        otherwise: (schema) => schema,
    }),
    breastfeeding: Yup.boolean().when('sex', {
        is: 'M',
        then: (schema) => schema.oneOf([false], 'Male cannot be pregnant'),
        otherwise: (schema) => schema,
    }),
    smoking: Yup.boolean(),
    drinking: Yup.boolean(),
    allergies: Yup.array().of(Yup.string().trim()).default([]),
    diseases: Yup.array().of(Yup.string().trim()).default([]),
});
