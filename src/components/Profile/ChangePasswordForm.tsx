import { ColumnBoxStyles, DOT } from '@/utils/consts';
import { PALETTE } from '@/utils/theme/colors';
import { Box, Button, Modal, Paper, TextField, Typography } from '@mui/material';
import { type ChangeEvent, memo, useCallback, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useI18n } from '../I18nProvider';
import { NetworkRequest } from '@/utils/NetworkRequest';

export const ChangePasswordForm = memo(() => {
    const [values, setValues] = useState({ password: '', confirmPassword: '' });
    const [openDrawer, setOpenDrawer] = useState(false);
    const [errors, setErrors] = useState<Record<'password' | 'confirmPassword', string>>({
        password: '',
        confirmPassword: '',
    });
    const [touched, setTouched] = useState({ password: false, confirmPassword: false });
    const [success, setSuccess] = useState(false);
    const { t } = useI18n();

    const toggleDrawer = useCallback(() => {
        setOpenDrawer((prev) => !prev);
    }, []);

    const validation = useCallback(() => {
        const errors = {
            password: '',
            confirmPassword: '',
        };

        if (!values.password) {
            errors.password = 'Password is required!';
        }

        if (!values.confirmPassword) {
            errors.confirmPassword = 'Confirm Password is required!';
        }

        if (values.password !== values.confirmPassword) {
            errors.confirmPassword = 'Passwords should match';
        }

        setErrors(errors);

        return Object.values(errors).some(Boolean);
    }, [values.confirmPassword, values.password]);

    useEffect(() => {
        validation();
    }, [validation]);

    useEffect(() => {
        if (!success) {
            return;
        }

        setTimeout(() => {
            setOpenDrawer(false);
        }, 2_000);
    }, [success]);

    const handleChange = (field: 'password' | 'confirmPassword') => {
        return (e: ChangeEvent<HTMLInputElement>) => {
            setValues((prev) => {
                return {
                    ...prev,
                    [field]: e.target.value,
                };
            });

            setTouched((prev) => {
                return {
                    ...prev,
                    [field]: true,
                };
            });
        };
    };

    const onSubmit = async () => {
        const validationError = validation();

        if (validationError) {
            return;
        }

        const { ok } = await NetworkRequest(
            '/profile/change-password',
            { password: values.password },
            { method: 'POST' }
        );

        if (!ok) return;

        setSuccess(true);
    };

    return (
        <Paper
            sx={{
                p: 2,
                borderRadius: '20px',
                mb: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <TextField
                value={new Array(10).fill(DOT).join('')}
                label="Password"
                autoComplete="on"
                variant="standard"
                disabled
                sx={{
                    '& . MuiFormLabel-root': {
                        color: 'rgba(28, 31, 31, 0.55)',
                    },
                    '& .MuiInputBase-input': {
                        WebkitTextFillColor: 'unset',
                    },
                    '& .MuiInputBase-root': {
                        color: '#000',
                    },
                    '& .MuiInput-root:before': {
                        borderBottom: 'none',
                        borderBottomStyle: 'none',
                    },
                    '& .MuiInput-root:after': {
                        borderBottom: 'none',
                        borderBottomStyle: 'none',
                    },
                    '& .MuiInput-root:hover:not(.Mui-disabled):before': {
                        borderBottom: 'none',
                        borderBottomStyle: 'none',
                    },
                }}
            />
            <Typography
                color="primary"
                onClick={toggleDrawer}
                sx={{
                    background: PALETTE.ICON_CONTAINER_DARK_GREEN,
                    p: '6px 14px',
                    fontSize: '14px',
                    borderRadius: '100px',
                    fontWeight: 600,
                }}
            >
                Change
            </Typography>
            <Modal
                open={openDrawer}
                onClose={toggleDrawer}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Paper sx={{ p: 4, position: 'relative', maxWidth: '90vw', borderRadius: '14px' }}>
                    <CloseIcon
                        onClick={toggleDrawer}
                        sx={{ position: 'absolute', top: '10px', right: '10px' }}
                    />
                    {success ? (
                        <Box sx={{ py: 5, px: 3, textAlign: 'center' }}>
                            <Typography variant="h2" mb={3}>
                                {t('Password has been changed')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('This modal will be closed shortly')}
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            <Typography variant="h2">{t('Change Password')}</Typography>
                            <Box
                                sx={{
                                    ...ColumnBoxStyles,
                                    mt: 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <TextField
                                    value={values.password}
                                    onChange={handleChange('password')}
                                    label="Password"
                                    autoComplete="on"
                                    variant="outlined"
                                    error={touched.password && !!errors.password}
                                    helperText={touched.password && errors.password}
                                />
                                <TextField
                                    value={values.confirmPassword}
                                    onChange={handleChange('confirmPassword')}
                                    label="Confirm Password"
                                    autoComplete="on"
                                    variant="outlined"
                                    error={touched.confirmPassword && !!errors.confirmPassword}
                                    helperText={touched.confirmPassword && errors.confirmPassword}
                                />
                                <Button
                                    variant="contained"
                                    sx={{ width: '100px' }}
                                    onClick={onSubmit}
                                >
                                    {t('Submit')}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Modal>
        </Paper>
    );
});
