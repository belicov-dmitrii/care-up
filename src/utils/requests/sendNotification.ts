import { headers } from 'next/headers';

export const sendNotification = async (
    userId: string,
    body: Partial<Record<'text' | 'date' | 'heading' | 'url', string>>
) => {
    const appId = process.env.ONESIGNAL_APP_ID;
    const apiKey = process.env.ONESIGNAL_REST_API_KEY;

    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto') || 'http';

    const origin = `${protocol}://${host}`;

    const fullUrl = body.url?.startsWith('http') ? body.url : `${origin}${body.url}`;

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
            url: fullUrl,
            send_after: body.date,
        }),
    });
    const responseBody = await response.json();

    return { data: responseBody, ok: response.ok };
};
