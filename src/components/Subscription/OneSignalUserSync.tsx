/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useUserContext } from '@/context/UserContext';
import { useEffect } from 'react';

declare global {
    interface Window {
        OneSignalDeferred?: Array<(OneSignal: any) => void>;
    }
}

export default function OneSignalUserSync() {
    const { userData } = useUserContext();

    useEffect(() => {
        if (!userData?.id) return;

        window.OneSignalDeferred = window.OneSignalDeferred || [];
        window.OneSignalDeferred.push(async (OneSignal) => {
            await OneSignal.login(userData?.id);
        });
    }, [userData?.id]);

    return null;
}
