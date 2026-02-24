import { sleep } from '@/utils/sleep';
import { NextResponse } from 'next/server';

const MOCK_LOGIN = 'test@test.com';
const MOCK_PASSWORD = '123123';

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
                id: '1',
                name: 'Demo User',
                email: MOCK_LOGIN,
                token,
            });

            response.cookies.set({
                name: 'auth_token',
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
