import { getUserDataByToken } from '@/utils/getUserDataByToken';
import { promises as fs } from 'fs';
import { type NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { AUTH_COOKIE_NAME } from '../login/route';
import { type Med } from '@/types';

const dataPath = (...p: string[]) => path.join(process.cwd(), 'data', ...p);

export async function POST(req: NextRequest) {
    try {
        const userId = (await getUserDataByToken(req.cookies.get(AUTH_COOKIE_NAME)?.value))?.id;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const file = await fs.readFile(dataPath('meds.json'), 'utf-8');
        const meds = JSON.parse(file);

        const userMeds = meds.filter((med: Med) => med.userId === userId);

        return NextResponse.json(userMeds);
    } catch (_) {
        return NextResponse.json({ error: 'Failed to read meds' }, { status: 500 });
    }
}
