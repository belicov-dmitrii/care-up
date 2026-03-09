import { type Med } from '@/types';
import { getUserDataByToken } from '@/utils/getUserDataByToken';
import { promises as fs } from 'fs';
import { type NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { AUTH_COOKIE_NAME } from '../login/route';

const dataPath = (...p: string[]) => path.join(process.cwd(), 'data', ...p);

export async function DELETE(req: NextRequest) {
    try {
        const userId = getUserDataByToken(req.cookies.get(AUTH_COOKIE_NAME)?.value)?.id;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await req.json();

        if (typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid med id' }, { status: 400 });
        }

        const filePath = dataPath('meds.json');

        const file = await fs.readFile(filePath, 'utf-8');
        const meds: Med[] = JSON.parse(file);

        if (!meds?.length) return NextResponse.json({ error: 'Med not found' }, { status: 404 });

        const updatedMeds = meds.filter((med) => med.id !== id);

        await fs.writeFile(filePath, JSON.stringify(updatedMeds, null, 4), 'utf-8');

        return NextResponse.json({}, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to create med' }, { status: 500 });
    }
}
