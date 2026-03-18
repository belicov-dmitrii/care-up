import { type NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '../login/route';
import { getUserDataByToken } from '@/utils/getUserDataByToken';

export async function GET(req: NextRequest) {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

    const user = await getUserDataByToken(token);

    if (!token || !user) {
        return NextResponse.json(
            { success: false, message: 'Missing credentials' },
            { status: 400 }
        );
    }

    return NextResponse.json(user, { status: 200 });
}
