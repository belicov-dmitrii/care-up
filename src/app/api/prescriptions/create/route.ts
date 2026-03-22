import { after, type NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { type Prescription } from '@/types';
import { sleep } from '@/utils/sleep';
import moment from 'moment';
import { DATE_FORMAT } from '@/utils/consts';
import { generatePrescriptionItems } from '@/utils/mocks/prescription';
import { getUserDataByToken } from '@/utils/getUserDataByToken';
import { AUTH_COOKIE_NAME } from '../../login/route';
import { sendNotification } from '@/utils/requests/sendNotification';

export const dynamic = 'force-dynamic';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRESCRIPTIONS_FILE = path.join(DATA_DIR, 'prescriptions.json');

const ALLOWED_MIME_TYPES = new Set([
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
]);

async function ensureDataFile(): Promise<void> {
    await fs.mkdir(DATA_DIR, { recursive: true });

    try {
        await fs.access(PRESCRIPTIONS_FILE);
    } catch {
        await fs.writeFile(PRESCRIPTIONS_FILE, '[]', 'utf-8');
    }
}

export async function readPrescriptionsFile(): Promise<Array<Prescription>> {
    await ensureDataFile();

    try {
        const raw = await fs.readFile(PRESCRIPTIONS_FILE, 'utf-8');
        const parsed = JSON.parse(raw);

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export async function writePrescriptionsFile(data: Array<Prescription>): Promise<void> {
    await ensureDataFile();
    await fs.writeFile(PRESCRIPTIONS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

async function finalizePrescription(prescriptionId: string, userId: string): Promise<void> {
    await sleep(60 * 1000);

    const meds = generatePrescriptionItems();

    const prescriptionsList = await readPrescriptionsFile();

    const nextList = prescriptionsList.map((prescription) => {
        if (prescription.id !== prescriptionId) {
            return prescription;
        }

        return {
            ...prescription,
            status: 'recognized' as const,
            meds,
        };
    });

    await writePrescriptionsFile(nextList);
    await sendNotification(userId, {
        heading: 'Your prescription is ready to check',
        url: `/docs/prescriptions/${prescriptionId}`,
        text: 'Click here to check it',
    });
}

export async function POST(req: NextRequest) {
    try {
        const userId = (await getUserDataByToken(req.cookies.get(AUTH_COOKIE_NAME)?.value))?.id;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file');

        if (!(file instanceof File)) {
            return Response.json({ ok: false, message: 'File is required.' }, { status: 400 });
        }

        if (!ALLOWED_MIME_TYPES.has(file.type)) {
            return Response.json(
                {
                    ok: false,
                    message: 'Only PDF and image files are allowed.',
                },
                { status: 400 }
            );
        }

        const newPrescription: Prescription & { userId: string } = {
            id: crypto.randomUUID(),
            userId,
            date: moment().format(DATE_FORMAT),
            status: 'processing',
            meds: [],
        };

        const prescriptionsList = await readPrescriptionsFile();
        prescriptionsList.unshift(newPrescription);
        await writePrescriptionsFile(prescriptionsList);

        after(async () => {
            try {
                await finalizePrescription(newPrescription.id, userId);
            } catch (error) {
                console.error('Failed to finalize prescription:', error);
            }
        });

        return Response.json({
            ok: true,
            data: newPrescription,
        });
    } catch (error) {
        console.error('Failed to create prescription:', error);

        return Response.json(
            {
                ok: false,
                message: 'Failed to create prescription.',
            },
            { status: 500 }
        );
    }
}
