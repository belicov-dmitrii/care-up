import { type NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '../login/route';
import { getUserDataByToken } from '@/utils/getUserDataByToken';

export async function GET(req: NextRequest) {
    return NextResponse.json(getUserDataByToken(req.cookies.get(AUTH_COOKIE_NAME)?.value));
}
