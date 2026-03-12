// app/api/onesignal/test/route.ts
import { getUserDataByToken } from '@/utils/getUserDataByToken';
import { type NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '../../login/route';

export async function POST(req: NextRequest) {
    const appId = process.env.ONESIGNAL_APP_ID;
    const apiKey = process.env.ONESIGNAL_REST_API_KEY;
    const userId = (await getUserDataByToken(req.cookies.get(AUTH_COOKIE_NAME)?.value))?.id;

    if (!appId || !apiKey || !userId) {
        return NextResponse.json({ error: 'Missing OneSignal envs' }, { status: 500 });
    }

    const response = await fetch('https://api.onesignal.com/notifications?c=push', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Key ${apiKey}`,
        },
        body: JSON.stringify({
            app_id: appId,
            include_aliases: {
                external_id: [userId],
            },
            target_channel: 'push',
            headings: { en: 'Test notification' },
            contents: { en: 'Hello from Next.js server route' },
        }),
    });

    const data = await response.json();

    return NextResponse.json({
        ok: response.ok,
        status: response.status,
        data,
    });
}
