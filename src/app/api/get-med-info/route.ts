import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { sleep } from '@/utils/sleep';
import { generateRandomMed } from '@/utils/generateRandomMed';

export const runtime = 'nodejs';

const uploadDir = path.join(process.cwd(), 'storage', 'uploads');

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: 'No file' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.mkdir(uploadDir, { recursive: true });

    const safeName = `${Date.now()}-${file.name}`.replace(/[^\w.\-]/g, '_');
    const fullPath = path.join(uploadDir, safeName);

    await fs.writeFile(fullPath, buffer);

    const newMed = generateRandomMed();

    await sleep(4000);

    return NextResponse.json({ ok: true, filename: safeName, med: newMed });
}
