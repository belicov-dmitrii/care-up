/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Modal, Typography, Stack } from '@mui/material';
import { NetworkRequest } from '@/utils/NetworkRequest';
import moment from 'moment';

const LS_KEY = 'push_prompt_dismissed_at';
const DISMISS_DAYS = 3;

function shouldShowAgain(): boolean {
    if (typeof window === 'undefined') return false;

    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return true;

    const dismissedAt = Number(raw);
    if (!dismissedAt) return true;

    const msPassed = Date.now() - dismissedAt;
    const daysPassed = msPassed / (1000 * 60 * 60 * 24);

    return daysPassed >= DISMISS_DAYS;
}

function markDismissed() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LS_KEY, String(Date.now()));
}

export default function PushNotificationGuard() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [browserPermission, setBrowserPermission] = useState<
        NotificationPermission | 'unsupported'
    >('default');

    useEffect(() => {
        const check = async () => {
            try {
                if (typeof window === 'undefined') return;

                if (!('Notification' in window)) {
                    setBrowserPermission('unsupported');
                    setLoading(false);
                    return;
                }

                const permission = Notification.permission;
                setBrowserPermission(permission);

                if (permission === 'granted') {
                    const oneSignal = (window as Window & { OneSignal?: any }).OneSignal;

                    if (!oneSignal) {
                        setLoading(false);
                        return;
                    }

                    try {
                        const optedIn = oneSignal.User?.PushSubscription?.optedIn;

                        if (!optedIn && shouldShowAgain()) {
                            setOpen(true);
                        }
                    } catch {}

                    setLoading(false);
                    return;
                }

                if ((permission === 'default' || permission === 'denied') && shouldShowAgain()) {
                    setOpen(true);
                }

                setLoading(false);
            } catch {
                setLoading(false);
            }
        };

        void check();
    }, []);

    useEffect(() => {
        NetworkRequest(
            'notifications/create',
            {
                text: `Repeat the created test`,
                headline: 'I said repeat!',
                date: moment().toISOString(),
                url: 'http://localhost:3000/docs/analysis/2b56ac73-17a6-4c19-bac6-c1e1faf77fb7/5ae07176-ba03-4437-a220-3b2167960f3a',
            },
            { method: 'POST' }
        );
    }, []);

    const handleEnable = async () => {
        try {
            setLoading(true);
            const oneSignal = (window as Window & { OneSignal?: any }).OneSignal;
            if (!oneSignal || !('Notification' in window)) return;

            const browserResult = await Notification.requestPermission();
            setBrowserPermission(browserResult);

            if (browserResult !== 'granted') {
                return;
            }

            await oneSignal.Notifications.requestPermission();

            const optedIn = oneSignal.User?.PushSubscription?.optedIn;

            if (optedIn) {
                setOpen(false);
            }
        } catch (error) {
            console.error('Failed to enable notifications', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        markDismissed();
        setOpen(false);
    };

    if (loading) return null;

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 420,
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    boxShadow: 24,
                    p: 3,
                    mx: 'auto',
                    mt: '15vh',
                }}
            >
                <Stack spacing={2}>
                    <Typography variant="h6" fontWeight={700}>
                        Enable notifications
                    </Typography>

                    {browserPermission === 'default' && (
                        <Typography variant="body2" color="text.secondary">
                            Enable notifications so the app can remind you about medication intake
                            and important updates.
                        </Typography>
                    )}

                    {browserPermission === 'denied' && (
                        <Typography variant="body2" color="text.secondary">
                            Notifications are blocked in your browser. To enable them, allow
                            notifications in browser settings for this site.
                        </Typography>
                    )}

                    {browserPermission === 'unsupported' && (
                        <Typography variant="body2" color="text.secondary">
                            This browser does not support push notifications.
                        </Typography>
                    )}

                    <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                        <Button variant="text" onClick={handleClose}>
                            Later
                        </Button>

                        {browserPermission !== 'unsupported' && (
                            <Button variant="contained" onClick={handleEnable}>
                                Enable
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </Box>
        </Modal>
    );
}
