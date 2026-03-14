import { getUserDataByToken } from '@/utils/getUserDataByToken';
import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '../../login/route';
import moment from 'moment';
import { APP_TIMEZONE_OFFSET } from '../sync/route';

export async function POST(req: NextRequest) {
    const appId = process.env.ONESIGNAL_APP_ID;
    const apiKey = process.env.ONESIGNAL_REST_API_KEY;

    if (!appId || !apiKey) {
        throw new Error('Missing ONESIGNAL_APP_ID or ONESIGNAL_REST_API_KEY');
    }

    const userId = (await getUserDataByToken(req.cookies.get(AUTH_COOKIE_NAME)?.value))?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.text || !body.date) {
        return NextResponse.json({ error: 'Invalid notification data' }, { status: 400 });
    }

    const date = moment(
        `${body.date} 15:00:00${APP_TIMEZONE_OFFSET}`,
        'YYYY-MM-DD HH:mm:ssZ',
        true
    );

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
            headings: {
                en: body.heading || 'New Notification',
            },
            contents: {
                en: body.text,
            },
            url: body.url,
            web_url: body.url,
            send_after: date.utc().toISOString(),
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`OneSignal error ${response.status}: ${JSON.stringify(data)}`);
    }

    return data;
}
