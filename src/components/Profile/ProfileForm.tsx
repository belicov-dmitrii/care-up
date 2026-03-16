'use client';

import { useUserContext } from '@/context/UserContext';
import { type UserData } from '@/types';
import { ColumnBoxStyles } from '@/utils/consts';
import { NetworkRequest } from '@/utils/NetworkRequest';
import { sleep } from '@/utils/sleep';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    Modal,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { memo, useEffect, useMemo, useState } from 'react';
import { profileSchema, profileSteps, type UserToSend } from './utils/steps';
import { useI18n } from '../I18nProvider';
import { ChangePasswordForm } from './ChangePasswordForm';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AvatarIcon } from '../icons/AvatarIcon';
import { PALETTE } from '@/utils/theme/colors';
import { FormElement } from '../Forms/FormElement';
import { FormTags } from '../Forms/FormTags';

export const ProfileForm = memo(() => {
    const [loading, setLoading] = useState(true);
    const [hiddenField, setHiddenFields] = useState<Array<keyof UserToSend>>([]);
    const [successModal, setSuccessModal] = useState(false);

    const { userData, logout, changeUserData } = useUserContext();
    const { t } = useI18n();

    useEffect(() => {
        if (!successModal) {
            return;
        }

        setTimeout(() => {
            setSuccessModal(false);
        }, 2_000);
    }, [successModal]);

    const formik = useFormik<Partial<UserToSend>>({
        initialValues: {},
        onSubmit: async (values) => {
            const castedValues = profileSchema.cast(values);
            const { data, ok } = await NetworkRequest<UserData>(
                '/profile/update-user-data',
                {
                    ...castedValues,
                },
                { method: 'POST' }
            );

            if (!ok) {
                return;
            }

            setSuccessModal(true);
            changeUserData(data);
        },
        validationSchema: profileSchema,
    });

    const { handleSubmit, handleChange, getFieldHelpers, setValues, values, errors } = formik;

    useEffect(() => {
        if (!loading || !userData) {
            return;
        }

        (async () => {
            setValues(userData, false);
            await sleep(400);
            setLoading(false);
        })();
    }, [setValues, loading, userData]);

    useEffect(() => {
        if (values.sex === 'M') {
            setHiddenFields(['pregnant', 'breastfeeding']);

            return;
        }

        setHiddenFields([]);
    }, [values.sex]);

    const customElements = useMemo(() => {
        return {
            allergies: (
                <FormTags
                    key="allergies"
                    value={values.allergies ?? []}
                    setValue={getFieldHelpers('allergies').setValue}
                    label="Allergies"
                    limit={8}
                />
            ),
            diseases: (
                <FormTags
                    key="diseases"
                    value={values.diseases ?? []}
                    setValue={getFieldHelpers('diseases').setValue}
                    label="Chronic diseases"
                    limit={8}
                />
            ),
        };
    }, [getFieldHelpers, values.allergies, values.diseases]);

    if (loading) {
        return (
            <Container
                sx={{
                    ...ColumnBoxStyles,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '200px',
                }}
            >
                <CircularProgress size={60} />
            </Container>
        );
    }

    const fields = profileSteps.filter((fieldSet) =>
        Array.isArray(fieldSet)
            ? fieldSet.filter(({ name }) => hiddenField.includes(name))
            : !hiddenField.includes(fieldSet.name)
    );

    return (
        <Container sx={ColumnBoxStyles}>
            <Stack textAlign="center">
                <Typography variant="h4" fontSize={22} mb={1}>
                    {values.name}
                </Typography>
                <Typography variant="body2">{userData?.email}</Typography>
            </Stack>
            <Typography
                sx={{
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    fontSize: '14px',
                    ml: 1,
                    letterSpacing: '0.5px ',
                }}
                color="text.secondary"
            >
                {t('Account Details')}
            </Typography>
            <form
                onSubmit={handleSubmit}
                style={{ ...ColumnBoxStyles, gap: 16, marginBottom: '50px' }}
            >
                <Paper sx={{ p: 2, borderRadius: '20px' }}>
                    <TextField
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        label="Nickname"
                        autoComplete="on"
                        variant="standard"
                        error={!!errors?.name}
                        helperText={errors?.name}
                        sx={{
                            '& .MuiInput-root:before': {
                                borderBottom: 'none',
                            },
                            '& .MuiInput-root:after': {
                                borderBottom: 'none',
                            },
                            '& .MuiInput-root:hover:not(.Mui-disabled):before': {
                                borderBottom: 'none',
                            },
                        }}
                    />
                </Paper>
                <ChangePasswordForm />
                <Accordion
                    defaultExpanded
                    slotProps={{
                        heading: { component: 'h4' },
                        root: {
                            style: {
                                margin: 0,
                                borderRadius: '14px',
                            },
                        },
                    }}
                    sx={{
                        fontFamily: 'var(--font-inter)',
                        borderRadius: '14px',
                        '&:before': {
                            content: 'none',
                        },
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="personal-information-content"
                        id="personal-information-content"
                        sx={{ minHeight: '64px' }}
                        slotProps={{
                            content: {
                                style: {
                                    margin: 0,
                                },
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Box
                                sx={{
                                    p: 1,
                                    background: PALETTE.ICON_CONTAINER_DARK_GREEN,
                                    borderRadius: '100px',
                                    color: PALETTE.TEXT_SUCCESS,
                                }}
                            >
                                <AvatarIcon />
                            </Box>
                            Personal Information
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0, borderRadius: '14px' }}>
                        <Divider />
                        <Box sx={{ p: 3, ...ColumnBoxStyles, gap: 3 }}>
                            <FormElement
                                errors={errors}
                                values={values}
                                formikChange={handleChange}
                                currentFields={fields}
                                customElements={customElements}
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Button
                    variant="contained"
                    type="submit"
                    sx={{ boxShadow: '0 6px 20px rgba(0, 0, 0, 0.03)', borderRadius: '14px' }}
                >
                    {t('Submit')}
                </Button>
            </form>
            <Button
                variant="contained"
                type="button"
                onClick={logout}
                sx={{
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.03)',
                    borderRadius: '14px',
                    background: '#FFF',
                    color: '#000',
                    '&:hover, &:active': {
                        background: '#C1C1C1',
                        color: '#000',
                    },
                }}
            >
                {t('Log out')}
            </Button>
            <Button
                variant="contained"
                type="button"
                onClick={logout}
                color="error"
                sx={{
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.03)',
                    borderRadius: '14px',
                    background: 'rgba(196, 112, 112, 0.1)',
                    color: '#C47070',
                    '&:hover, &:active': {
                        background: 'rgba(196, 112, 112, 0.3)',
                        color: '#C47070',
                    },
                }}
            >
                {t('Delete account')}
            </Button>
            <Modal
                open={successModal}
                onClose={() => setSuccessModal(false)}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Paper sx={{ p: 3, borderRadius: '14px', textAlign: 'center' }}>
                    <Typography variant="h2" mb={3}>
                        {' '}
                        User has been updated
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t('This modal will be closed shortly')}
                    </Typography>
                </Paper>
            </Modal>
        </Container>
    );
});
