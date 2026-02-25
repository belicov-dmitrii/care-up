import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, MOCK_USER_DATA } from '../login/route';

export async function GET(req: NextRequest) {
    if (req.cookies.get(AUTH_COOKIE_NAME)) {
        return NextResponse.json({
            ...MOCK_USER_DATA,
        });
    }
}
