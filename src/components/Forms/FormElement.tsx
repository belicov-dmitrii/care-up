import { type FormikValues, type FormikHandlers } from 'formik';
import React, { type ReactNode, type FC } from 'react';
import { useI18n } from '../I18nProvider';
import { Box, MenuItem, TextField } from '@mui/material';

export type FormFieldType<T extends string> = {
    name: T;
    label: string;
    type: 'text' | 'select' | 'custom';
    options?: Array<{ value: string; display: string }>;
};

export type FormFields<T extends string> = Array<FormFieldType<T> | Array<FormFieldType<T>>>;

export interface IFormElementProps {
    values: FormikValues;
    formikChange: FormikHandlers['handleChange'];
    currentFields: FormFields<string>;
    customElements?: Record<string, ReactNode>;
}

export const FormElement: FC<IFormElementProps> = ({
    values,
    customElements,
    formikChange,
    currentFields,
}) => {
    const { t } = useI18n();

    return currentFields.map((field, index) => {
        if (Array.isArray(field)) {
            return (
                <Box
                    key={`field-group-${index}`}
                    sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}
                >
                    <FormElement
                        values={values}
                        formikChange={formikChange}
                        currentFields={field}
                    />
                </Box>
            );
        }

        switch (field.type) {
            case 'custom':
                return customElements?.[field.name] || <div>No custom element provided</div>;
            case 'select':
                return (
                    <TextField
                        variant="outlined"
                        select
                        key={field.name}
                        label={t(field.label)}
                        name={field.name}
                        value={values[field.name]}
                        onChange={formikChange}
                    >
                        {field.options?.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.display}
                            </MenuItem>
                        ))}
                    </TextField>
                );
            case 'text':
            default:
                return (
                    <TextField
                        autoComplete="off"
                        variant="outlined"
                        key={field.name}
                        label={t(field.label)}
                        name={field.name}
                        value={values[field.name]}
                        onChange={formikChange}
                    />
                );
        }
    });
};
