/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useUserContext } from '@/context/UserContext';
import { NetworkRequest } from '@/utils/NetworkRequest';
import { memo, useEffect } from 'react';

export const NotificationSync = memo(() => {
    const { userData } = useUserContext();

    useEffect(() => {
        if (!userData?.id) {
            return;
        }

        // HINT: UNCOMMENT THIS TO SET NOTIFICATIONS
        // NetworkRequest('/notifications/sync', {}, { method: 'POST' });
    }, [userData?.id]);

    return null;
});
