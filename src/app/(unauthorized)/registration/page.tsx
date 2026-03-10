'use client';

import { FormElement, type FormFields } from '@/components/Forms/FormElement';
import { useI18n } from '@/components/I18nProvider';
import { registrationSteps, registrationTitles } from '@/components/Registration/utils/steps';
import { type NewUserDataType } from '@/components/Registration/utils/types';
import { PALETTE } from '@/utils/theme/colors';
import { Box, Button, Container, LinearProgress, Paper, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { getStepFieldNames } from '@/utils/validation';
import { FormTags } from '@/components/Forms/FormTags';
import Link from 'next/link';
import { NetworkRequest } from '@/utils/NetworkRequest';
import { useRouter } from 'next/navigation';
import { registrationValidationSchema } from '@/components/Registration/utils/registrationValidationSchema';
import { formFloatingAnimation } from '@/utils/consts';

const EMPTY_USER = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    height: '',
    weight: '',
    pregnant: false,
    breastfeeding: false,
    smoking: false,
    drinking: false,
    allergies: [],
    diseases: [],
};

export default function RegistrationPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
    const [hiddenField, setHiddenFields] = useState<Array<keyof NewUserDataType>>([]);
    const router = useRouter();

    const formik = useFormik<NewUserDataType>({
        initialValues: {
            ...EMPTY_USER,
            sex: 'M',
        },
        onSubmit: async (values) => {
            const castedValues = registrationValidationSchema.cast(values);

            const { ok } = await NetworkRequest(
                '/register-user',
                { ...castedValues },
                { method: 'POST' }
            );

            if (ok) {
                return router.replace('/login');
            }
        },
        validationSchema: registrationValidationSchema,
    });

    const { t } = useI18n();

    const changeStep = async (type: 'forward' | 'backward') => {
        const currentStepFields = getStepFieldNames<FormFields<keyof NewUserDataType>>(
            registrationSteps[currentStep]
        );

        const errors = await formik.validateForm();

        const hasStepErrors = currentStepFields.some((fieldName) => !!errors[fieldName]);

        if (hasStepErrors) {
            currentStepFields.forEach((fieldName) => {
                formik.setFieldTouched(fieldName, true, true);
            });

            return;
        }

        if (type === 'forward') {
            setDirection('forward');
            setCurrentStep((prev) => prev + 1);

            return;
        }

        setDirection('backward');
        setCurrentStep((prev) => prev - 1);
    };

    const { handleSubmit, handleChange, getFieldHelpers, values, errors, touched } = formik;

    const customElements = useMemo(() => {
        return {
            allergies: (
                <FormTags
                    key="allergies"
                    value={values.allergies}
                    setValue={getFieldHelpers('allergies').setValue}
                    label="Allergies"
                    limit={8}
                />
            ),
            diseases: (
                <FormTags
                    key="diseases"
                    value={values.diseases}
                    setValue={getFieldHelpers('diseases').setValue}
                    label="Chronic diseases"
                    limit={8}
                />
            ),
        };
    }, [getFieldHelpers, values.allergies, values.diseases]);

    useEffect(() => {
        if (values.sex === 'M') {
            setHiddenFields(['pregnant', 'breastfeeding']);

            return;
        }

        setHiddenFields([]);
    }, [values.sex]);

    const stepPercentage = ((currentStep + 1) / registrationSteps.length) * 100;

    const touchedError = Object.fromEntries(
        Object.entries(errors).filter(([key]) => touched[key as keyof typeof touched])
    );

    const selectedFields = registrationSteps[currentStep].filter((fieldSet) =>
        Array.isArray(fieldSet)
            ? fieldSet.filter(({ name }) => hiddenField.includes(name))
            : !hiddenField.includes(fieldSet.name)
    );

    return (
        <Container
            sx={{
                bgcolor: 'background.default',
                px: 2,
                py: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
            }}
        >
            <Box textAlign="center">
                <Typography variant="h3" fontSize="14px" color="text.secondary" mb={1}>
                    { t('Step {step} of {steps}', { step: currentStep + 1, steps: registrationSteps.length }) }
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={stepPercentage}
                    sx={{
                        borderRadius: '6px',
                        width: '140px',
                        height: '6px',
                        '& > span': {
                            borderRadius: '6px',
                        },
                    }}
                />
            </Box>
            <form
                onSubmit={handleSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '2 2',
                    justifyContent: 'space-around',
                    height: '100%',
                }}
            >
                <Box
                    sx={{
                        flex: '2 2',
                        justifyContent: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            variants={formFloatingAnimation}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.35 }}
                        >
                            <Paper sx={{ p: '20px', borderRadius: '14px', minHeight: '200px' }}>
                                <Box>
                                    <Typography variant="h2" fontSize="24px" mb={3}>
                                        {t(registrationTitles[currentStep].title)}
                                    </Typography>
                                    <Typography fontSize="16px" mb={3} color="text.secondary">
                                        {t(registrationTitles[currentStep].subtitle)}
                                    </Typography>
                                </Box>
                                <Box
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        height: '100%',
                                        minHeight: '200px',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 2,
                                            alignItems: 'center',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <FormElement
                                            errors={touchedError}
                                            values={values}
                                            formikChange={handleChange}
                                            currentFields={selectedFields}
                                            customElements={customElements}
                                        />
                                    </Box>
                                </Box>
                            </Paper>
                        </motion.div>
                    </AnimatePresence>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mt: 2,
                            gap: 2,
                            borderRadius: '14px',
                            '& button': {
                                flex: '1 1',
                            },
                        }}
                    >
                        {!!currentStep && (
                            <Button
                                type="button"
                                onClick={() => changeStep('backward')}
                                variant="contained"
                            >
                                {t('Prev')}
                            </Button>
                        )}

                        {currentStep === registrationSteps.length - 1 ? (
                            <Button type="submit" variant="contained" key="submit">
                                {t('Submit')}
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={() => changeStep('forward')}
                                variant="contained"
                            >
                                {t('Next')}
                            </Button>
                        )}
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        pt: 4,
                        pb: 2,
                        fontSize: '13px',
                        color: PALETTE.BRAND_TEAL_DARK_PALE,
                    }}
                >
                    <Box fontSize="16px">
                        <VerifiedUserOutlinedIcon fontSize="inherit" />
                    </Box>
                    {t('Your data stays private.')}
                </Box>
            </form>
            <Link href="/login" style={{ width: '100%' }}>
                <Button variant="contained" type="button" sx={{ width: '100%' }}>
                    {t('Back To Login')}
                </Button>
            </Link>
        </Container>
    );
}
