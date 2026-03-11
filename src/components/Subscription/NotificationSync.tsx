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

        NetworkRequest('/notifactions/sync', {}, { method: 'POST' });
    }, [userData?.id]);
});
