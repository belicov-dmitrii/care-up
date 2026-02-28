'use client';

import { memo, useCallback, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { logError } from '@/utils/logError';
import { NetworkRequest } from '@/utils/NetworkRequest';
import { type ILoginResponse } from './utils/types';
import { useUserContext } from '@/context/UserContext';
import { useRouter, useSearchParams } from 'next/navigation';

export const LoginForm = memo(() => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { changeUserData } = useUserContext();

    const submit = useCallback(async () => {
        setIsSubmitting(true);
        try {
            const error = validate(email, password);

            if (error) {
                setError(error);

                return;
            }

            const { data, ok } = await NetworkRequest<ILoginResponse>(
                '/login',
                {
                    email,
                    password,
                },
                { method: 'POST' }
            );

            if (!ok) {
                throw new Error('Login issue');
            }

            changeUserData(data);
            router.replace(searchParams.get('next') ?? '/dashboard');
        } catch (error) {
            logError(error);
        } finally {
            setIsSubmitting(false);
        }
    }, [changeUserData, email, password, router, searchParams]);

    return (
        <Box position="relative">
            {isSubmitting && (
                <Box>
                    <Box className="overlay">
                        <CircularProgress />
                    </Box>
                </Box>
            )}
            <Stack spacing={1.5} sx={{ mt: 1 }}>
                <TextField
                    placeholder="Email address"
                    autoComplete="email"
                    value={email}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MailOutlineRoundedIcon color="action" />
                                </InputAdornment>
                            ),
                        },
                    }}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    placeholder="Password"
                    type="password"
                    value={password}
                    autoComplete="current-password"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon color="action" />
                                </InputAdornment>
                            ),
                        },
                    }}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Stack>
            <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={!email || !password}
                sx={{ mt: 2 }}
                size="large"
                onClick={submit}
            >
                Continue
            </Button>
            {error && <Typography color="error">{error}</Typography>}
        </Box>
    );
});

const validate = (email: string, password: string) => {
    if (!email || !password) {
        return 'Please enter your credentials';
    }

    if (!email.includes('@')) {
        return 'Please enter a valid email';
    }

    return '';
};
