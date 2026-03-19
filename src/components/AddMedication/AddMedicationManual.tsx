import { type Med, MedForm, MedUnit } from '@/types';
import { useFormik } from 'formik';
import moment from 'moment';
import { type FC, memo, useMemo, useState } from 'react';
import { type NewMedType, type IAddMedicationChildProps } from './utils/types';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import { useI18n } from '../I18nProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { FormElement } from '../Forms/FormElement';
import { addMedicationManualSteps, addMedicationManualStepsTitles } from './utils/steps';
import { AddMedicationStepChooser } from './utils/types';
import { ExpirationDateChooser } from './ExpirationDateChooser';
import { NetworkRequest } from '@/utils/NetworkRequest';
import * as Yup from 'yup';
import { PALETTE } from '@/utils/theme/colors';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { formFloatingAnimation } from '@/utils/consts';

const EMPTY_MED: NewMedType = {
    medName: '',
    form: MedForm.Capsules,
    strength: 0,
    unit: MedUnit.Mg,
    dose: 1,
    remaining: 100,
    expirationDate: moment().add(1, 'year'),
};

const validationSchema = Yup.object({
    medName: Yup.string().max(30, 'Must be 30 characters or less').required('Required'),
    strength: Yup.number().typeError('Must be a number').min(0).required('Required'),
    dose: Yup.number().typeError('Must be a number').min(0).required('Required'),
    remaining: Yup.number().typeError('Must be a number').min(0).required('Required'),
});

export const AddMedicationManual: FC<IAddMedicationChildProps> = memo(
    ({ medData, changeMedData, setStep }) => {
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
                const { data, ok } = await NetworkRequest<Med>(
                    '/add-med',
                    {
                        ...castedValues,
                        expirationDate: values.expirationDate?.format('YYYY-MM-DD'),
                        name: values.medName,
                    },
                    { method: 'POST' }
                );

                if (!ok) {
                    return;
                }

                changeMedData(data);
                setStep(AddMedicationStepChooser.CreateSchedule);
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
            <Box height="100%">
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                    }}
                >
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
                                variants={formFloatingAnimation}
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
                                                values={values}
                                                formikChange={handleChange}
                                                currentFields={
                                                    addMedicationManualSteps[currentStep]
                                                }
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

                            {currentStep === addMedicationManualSteps.length - 1 ? (
                                <Button type="submit" variant="contained" key="submit">
                                    {t('Submit')}
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={() => changeStep('forward')}
                                    variant="contained"
                                    key="next"
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
            </Box>
        );
    }
);
