import { type MedForm, type MedUnit, type Med } from '@/types';
import { getUserDataByToken } from '@/utils/getUserDataByToken';
import { promises as fs } from 'fs';
import { type NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { AUTH_COOKIE_NAME } from '../login/route';

const dataPath = (...p: string[]) => path.join(process.cwd(), 'data', ...p);

type UpdateMedBody = Partial<Omit<Med, 'userId'>> & { id: string };

const allowedKeys: (keyof UpdateMedBody)[] = [
    'id',
    'remaining',
    'quantity',
    'unit',
    'dose',
    'expirationDate',
    'form',
    'strength',
    'name',
];

const UpdateMedValueTypes: Record<keyof UpdateMedBody, 'string' | 'number' | MedUnit | MedForm> = {
    id: 'string',
    name: 'string',
    dose: 'number',
    unit: 'string' as MedUnit,
    form: 'string' as MedForm,
    expirationDate: 'string',
    quantity: 'number',
    remaining: 'number',
    strength: 'number',
};

function isValidUpdateMedBody(body: unknown): body is UpdateMedBody {
    if (!body || typeof body !== 'object') {
        return false;
    }

    const candidate = body as Record<string, unknown>;

    if (typeof candidate?.id !== 'string') return false;

    const areFieldsMatching = Object.entries(candidate).every(
        ([key, value]) =>
            allowedKeys.includes(key as keyof UpdateMedBody) &&
            typeof value === UpdateMedValueTypes[key as keyof UpdateMedBody]
    );

    return areFieldsMatching;
}

export async function PATCH(req: NextRequest) {
    try {
        const userId = (await getUserDataByToken(req.cookies.get(AUTH_COOKIE_NAME)?.value))?.id;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        if (!isValidUpdateMedBody(body)) {
            return NextResponse.json({ error: 'Invalid med data' }, { status: 400 });
        }

        const filePath = dataPath('meds.json');

        const file = await fs.readFile(filePath, 'utf-8');
        const meds: Med[] = JSON.parse(file);
        let targetMed = meds?.find((med) => med.id === body.id);

        if (!meds?.length || !targetMed)
            return NextResponse.json({ error: 'Med not found' }, { status: 404 });

        targetMed = {
            ...targetMed,
            ...body,
        };

        const updatedMeds = meds.map((med) => {
            if (med.id === targetMed?.id) {
                return targetMed;
            }
            return med;
        });

        await fs.writeFile(filePath, JSON.stringify(updatedMeds, null, 4), 'utf-8');

        return NextResponse.json(targetMed, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to create med' }, { status: 500 });
    }
}
