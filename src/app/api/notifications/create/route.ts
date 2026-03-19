import { getUserDataByToken } from '@/utils/getUserDataByToken';
import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '../../login/route';
import { sendNotification } from '@/utils/requests/sendNotification';

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

    const body: Record<'text' | 'date' | 'heading' | 'url', string> = await req.json();

    if (!body.text || !body.date) {
        return NextResponse.json({ error: 'Invalid notification data' }, { status: 400 });
    }

    const data = await sendNotification(userId, body);

    if (!data.ok) {
        throw new Error(`OneSignal error ${data.status}: ${JSON.stringify(data)}`);
    }

    return data;
}
