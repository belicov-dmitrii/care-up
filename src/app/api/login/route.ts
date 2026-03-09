import { sleep } from '@/utils/sleep';
import { NextResponse } from 'next/server';

import { verifyPassword } from '@/utils/verifyPassword';
import { readUsers } from '@/utils/readUsers';

export const AUTH_COOKIE_NAME = 'auth_token';

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

        const users = await readUsers();

        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const { password: userPassword, token, ...userToSend } = user;
        const passwordValid = verifyPassword(password, user.password);

        if (!passwordValid) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const response = NextResponse.json(userToSend);

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
    } catch (_) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
