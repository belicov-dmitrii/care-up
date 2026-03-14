'use client';

import { NetworkRequest } from '@/utils/NetworkRequest';
import { useEffect } from 'react';

export const TestNotification = () => {
    useEffect(() => {
        (async () => {
            await NetworkRequest('/onesignal/test', {}, { method: 'POST' });
        })();
    }, []);

    return null;
};
