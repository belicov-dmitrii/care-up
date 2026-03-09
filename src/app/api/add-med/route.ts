import { MedForm, MedUnit, type Med } from '@/types';
import { getUserDataByToken } from '@/utils/getUserDataByToken';
import { promises as fs } from 'fs';
import { type NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { AUTH_COOKIE_NAME } from '../login/route';

const dataPath = (...p: string[]) => path.join(process.cwd(), 'data', ...p);

type CreateMedBody = Omit<Med, 'id' | 'userId'>;

function isValidCreateMedBody(body: unknown): body is CreateMedBody {
    if (!body || typeof body !== 'object') {
        return false;
    }

    const candidate = body as Record<string, unknown>;

    return (
        typeof candidate.name === 'string' &&
        Object.keys(MedForm).includes(candidate.form as MedForm) &&
        typeof candidate.strength === 'number' &&
        Object.keys(MedUnit).includes(candidate.unit as MedUnit) &&
        typeof candidate.dose === 'number' &&
        typeof candidate.remaining === 'number'
    );
}

export async function POST(req: NextRequest) {
    try {
        const userId = getUserDataByToken(req.cookies.get(AUTH_COOKIE_NAME)?.value)?.id;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        if (!isValidCreateMedBody(body)) {
            return NextResponse.json({ error: 'Invalid med data' }, { status: 400 });
        }

        const filePath = dataPath('meds.json');

        const file = await fs.readFile(filePath, 'utf-8');
        const meds: Med[] = JSON.parse(file);

        const newMed: Med = {
            id: crypto.randomUUID(),
            userId,
            name: body.name.trim(),
            form: body.form,
            strength: body.strength,
            unit: body.unit,
            dose: body.dose,
            remaining: body.remaining,
            quantity: body.quantity,
            expirationDate: body.expirationDate,
        };

        meds.push(newMed);

        await fs.writeFile(filePath, JSON.stringify(meds, null, 4), 'utf-8');

        return NextResponse.json(newMed, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to create med' }, { status: 500 });
    }
}
