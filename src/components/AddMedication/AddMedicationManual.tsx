import { MedForm, MedUnit } from '@/types';
import { useFormik } from 'formik';
import moment from 'moment';
import { type FC, memo, useMemo, useState } from 'react';
import { type NewMedType, type IAddMedicationChildProps } from './utils/types';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import { useI18n } from '../I18nProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { FormElement } from '../Forms/FormElement';
import { addMedicationManualSteps, addMedicationManualStepsTitles } from './utils/steps';
import { ExpirationDateChooser } from './ExpirationDateChooser';
import { NetworkRequest } from '@/utils/NetworkRequest';
import * as Yup from 'yup';

const EMPTY_MED: NewMedType = {
    medName: '',
    form: MedForm.Capsules,
    strength: 0,
    unit: MedUnit.Mg,
    dose: 1,
    remaining: 100,
    expirationDate: moment().add(1, 'year'),
};

const animation = {
    enter: (direction: 'forward' | 'backward') => ({
        x: direction === 'forward' ? 500 : -500,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: 'forward' | 'backward') => ({
        x: direction === 'forward' ? -500 : 500,
    }),
};

const validationSchema = Yup.object({
    medName: Yup.string().max(30, 'Must be 30 characters or less').required('Required'),
    strength: Yup.number().typeError('Must be a number').min(0).required('Required'),
    dose: Yup.number().typeError('Must be a number').min(0).required('Required'),
    remaining: Yup.number().typeError('Must be a number').min(0).required('Required'),
});

export const AddMedicationManual: FC<IAddMedicationChildProps> = memo(({ medData }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

    const { expirationDate, id, userId, name: medDateName, ...medDateToFill } = medData;

    const formik = useFormik<NewMedType>({
        initialValues: {
            ...EMPTY_MED,
            ...medDateToFill,
            medName: medDateName ?? '',
        },
        onSubmit: async (values) => {
            const castedValues = validationSchema.cast(values);
            console.log('🚀 ~ castedValues:', castedValues);
            await NetworkRequest(
                '/add-med',
                {
                    ...castedValues,
                    expirationDate: values.expirationDate?.format('YYYY-MM-DD'),
                    name: values.medName,
                },
                { method: 'POST' }
            );
        },
        validationSchema,
    });

    const { t } = useI18n();

    const changeStep = (type: 'forward' | 'backward') => {
        if (type === 'forward') {
            setDirection('forward');
            setCurrentStep((prev) => prev + 1);

            return;
        }

        setDirection('backward');
        setCurrentStep((prev) => prev - 1);
    };

    const { handleSubmit, handleChange, getFieldHelpers, values } = formik;

    const customElements = useMemo(() => {
        return {
            expirationDate: (
                <ExpirationDateChooser
                    key="expiration-date"
                    value={values.expirationDate}
                    setValue={getFieldHelpers('expirationDate').setValue}
                />
            ),
        };
    }, [getFieldHelpers, values.expirationDate]);

    return (
        <Box>
            <Box textAlign="center">
                <Typography variant="h3" fontSize="18px" mb={1}>
                    {t('Add Medication')}
                </Typography>
                <Typography fontSize="13px" color="text.secondary">
                    {t('addMedicationHelper')}
                </Typography>
            </Box>
            <Divider sx={{ my: 3 }} />
            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={animation}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35 }}
                >
                    <Paper sx={{ p: '20px', borderRadius: '14px', minHeight: '200px' }}>
                        <Box>
                            <Typography variant="h3" fontSize="18px" mb={3}>
                                {t(addMedicationManualStepsTitles[currentStep])}
                            </Typography>
                        </Box>
                        <form
                            onSubmit={handleSubmit}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
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
                                    values={values}
                                    formikChange={handleChange}
                                    currentFields={addMedicationManualSteps[currentStep]}
                                    customElements={customElements}
                                />
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mt: 2,
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

                                {currentStep === addMedicationManualSteps.length - 1 ? (
                                    <Button type="submit" variant="contained">
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
                        </form>
                    </Paper>
                </motion.div>
            </AnimatePresence>
        </Box>
    );
});
