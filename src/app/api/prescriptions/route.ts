import { getUserDataByToken } from '@/utils/getUserDataByToken';
import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '../login/route';
import { promises as fs } from 'fs';
import path from 'path';
import { type Prescription } from '@/types';

const dataPath = (...p: string[]) => path.join(process.cwd(), 'data', ...p);

export async function POST(req: NextRequest) {
    try {
        const userId = (await getUserDataByToken(req.cookies.get(AUTH_COOKIE_NAME)?.value))?.id;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await req.json();

        const filePath = dataPath('prescriptions.json');

        const file = await fs.readFile(filePath, 'utf-8');

        const prescriptions: Prescription[] = JSON.parse(file);
        const userPrescriptions: Prescription[] = prescriptions.filter(
            (prescription) => prescription.userId === userId
        );

        let result: Prescription | Prescription[] | undefined = userPrescriptions;

        if (id) {
            result = userPrescriptions.find(({ id: prescriptionId }) => prescriptionId === id);
        }

        return NextResponse.json(result, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to got prescriptions' }, { status: 500 });
    }
}
