import { type FormikValues, type FormikHandlers } from 'formik';
import React, { type ReactNode, type FC } from 'react';
import { useI18n } from '../I18nProvider';
import { Box, InputAdornment, MenuItem, TextField, Typography } from '@mui/material';
import { PALETTE } from '@/utils/theme/colors';
import { IOSSwitch } from '../IOSSwitch/IOSSwitch';

export type FormFieldType<T extends string> = {
    name: T;
    label: string;
    type: 'text' | 'password' | 'select' | 'custom' | 'toggle' | 'tags';
    options?: Array<{ value: string; display: string }>;
    endAdornment?: string;
};

export type FormFields<T extends string> = Array<FormFieldType<T> | Array<FormFieldType<T>>>;

export interface IFormElementProps {
    values: FormikValues;
    errors?: Record<string, string | Array<string>>;
    formikChange: FormikHandlers['handleChange'];
    currentFields: FormFields<string>;
    customElements?: Record<string, ReactNode>;
}

export const FormElement: FC<IFormElementProps> = ({
    values,
    errors,
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
                        error={!!errors?.[field.name]}
                        helperText={errors?.[field.name]}
                        onChange={formikChange}
                    >
                        {field.options?.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.display}
                            </MenuItem>
                        ))}
                    </TextField>
                );
            case 'toggle':
                return (
                    <Box
                        key={field.name}
                        sx={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Typography fontSize="16px" color={PALETTE.BRAND_BLACK}>
                            {field.label}
                        </Typography>
                        <IOSSwitch
                            key={field.name}
                            name={field.name}
                            checked={values[field.name]}
                            onChange={formikChange}
                        />
                    </Box>
                );
            case 'text':
            case 'password':
            default:
                let adormentProps = {};

                if (field.endAdornment) {
                    adormentProps = {
                        slotProps: {
                            input: {
                                endAdornment: (
                                    <InputAdornment position="start">
                                        {field.endAdornment}
                                    </InputAdornment>
                                ),
                            },
                        },
                    };
                }
                return (
                    <TextField
                        autoComplete="on"
                        variant="outlined"
                        type={field.type}
                        key={field.name}
                        label={t(field.label)}
                        name={field.name}
                        value={values[field.name]}
                        error={!!errors?.[field.name]}
                        helperText={errors?.[field.name]}
                        onChange={formikChange}
                        {...adormentProps}
                    />
                );
        }
    });
};
