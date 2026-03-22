'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function OneSignalNavigationListener() {
    const router = useRouter();

    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data?.type !== 'ONESIGNAL_NAVIGATE') return;

            try {
                const target = new URL(event.data.url, window.location.origin);

                // only handle same-origin urls in-app
                if (target.origin !== window.location.origin) {
                    window.location.href = target.href;
                    return;
                }

                const nextUrl = `${target.pathname}${target.search}${target.hash}`;
                router.push(nextUrl);
            } catch {
                // fallback
                if (typeof event.data?.url === 'string') {
                    window.location.href = event.data.url;
                }
            }
        };

        navigator.serviceWorker?.addEventListener('message', handler);
        return () => {
            navigator.serviceWorker?.removeEventListener('message', handler);
        };
    }, [router]);

    return null;
}
