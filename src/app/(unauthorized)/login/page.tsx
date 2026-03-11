import { Box, Paper, Typography, Stack, Avatar, Container, Button } from '@mui/material';

import { Spa } from '@mui/icons-material';
import { LoginForm } from '@/components/LoginForm/LoginForm';
import Link from 'next/link';

export default function AuthLoginPage() {
    return (
        <Container
            sx={{
                bgcolor: 'background.default',
                px: 2,
                py: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                gap: 3,
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    width: '90%',
                    mx: 'auto',
                    height: { xs: 300, sm: 350 },
                    borderRadius: 6,
                    bgcolor: 'rgba(15, 23, 42, 0.04)',
                    boxShadow:
                        '0px 1px 2px rgba(15, 23, 42, 0.06), 0px 10px 24px rgba(15, 23, 42, 0.06)',
                    overflow: 'hidden',
                }}
            >
                <video
                    src="/image_login-gif.mp4"
                    muted
                    loop
                    autoPlay
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                    }}
                />
            </Box>
            <Paper
                sx={{
                    width: '100%',
                    maxWidth: 520,
                    mx: 'auto',
                    p: 3,
                    borderRadius: 6,
                }}
            >
                <Stack spacing={2.25}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                            sx={{
                                width: 44,
                                height: 44,
                                bgcolor: 'rgba(47, 107, 102, 0.10)', // uses same teal-tint style as chips
                                color: 'primary.main',
                                fontWeight: 700,
                            }}
                        >
                            <Spa />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" sx={{ lineHeight: 1.1 }}>
                                Care Up
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Your gentle guide to daily health and wellbeing.
                            </Typography>
                        </Box>
                    </Box>
                    <LoginForm />
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            textAlign: 'center',
                            px: 2,
                            pt: 0.5,
                            fontSize: 13,
                        }}
                    >
                        By continuing, you agree to our terms.
                        <br />
                        Your data is always private and secure.
                    </Typography>
                </Stack>
            </Paper>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    width: '100%',
                }}
            >
                <Typography sx={{ textAlign: 'center', mb: 2 }}>
                    You don&apos;t have an account?{' '}
                </Typography>
                <Link href="/registration">
                    <Button variant="contained" sx={{ width: '100%' }}>
                        Register Now
                    </Button>
                </Link>
            </Box>
        </Container>
    );
}
