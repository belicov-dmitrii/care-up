import { sleep } from '@/utils/sleep';
import { NextResponse } from 'next/server';

const MOCK_LOGIN = 'test@test.com';
const MOCK_PASSWORD = '123123';

export const AUTH_COOKIE_NAME = 'auth_token';

export const MOCK_USER_DATA = {
    id: '1',
    name: 'Demo User',
    email: MOCK_LOGIN,
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        await sleep(3000);

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Missing credentials' },
                { status: 400 }
            );
        }

        if (email === MOCK_LOGIN && password === MOCK_PASSWORD) {
            const token = crypto.randomUUID();

            const response = NextResponse.json({
                ...MOCK_USER_DATA,
                token,
            });

            response.cookies.set({
                name: AUTH_COOKIE_NAME,
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24,
            });

            return response;
        }

        return NextResponse.json(
            { success: false, message: 'Invalid login or password' },
            { status: 401 }
        );
    } catch (_) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
