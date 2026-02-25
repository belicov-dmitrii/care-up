import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

const dataPath = (...p: string[]) => path.join(process.cwd(), 'data', ...p);

export async function POST() {
    try {
        const file = await fs.readFile(dataPath('schedule.json'), 'utf-8');
        const meds = JSON.parse(file);

        return NextResponse.json(meds);
    } catch (_) {
        return NextResponse.json({ error: 'Failed to read schedule' }, { status: 500 });
    }
}
