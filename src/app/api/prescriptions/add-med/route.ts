import { getUserDataByToken } from '@/utils/getUserDataByToken';
import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '../../login/route';
import { readPrescriptionsFile, writePrescriptionsFile } from '../create/route';
import { type Prescription } from '@/types';

interface CreateMedBody {
    medId: string;
    prescriptionId: string;
    itemId: string;
}

const isValidAddMedBody = (body: unknown): body is CreateMedBody => {
    if (!body || typeof body !== 'object') {
        return false;
    }

    const candidate = body as Record<string, unknown>;

    return (
        typeof candidate.medId === 'string' &&
        typeof candidate.prescriptionId === 'string' &&
        typeof candidate.itemId === 'string'
    );
};

export async function POST(req: NextRequest) {
    try {
        const userId = (await getUserDataByToken(req.cookies.get(AUTH_COOKIE_NAME)?.value))?.id;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        if (!isValidAddMedBody(body)) {
            return NextResponse.json({ error: 'Invalid med data' }, { status: 400 });
        }

        const prescriptions = await readPrescriptionsFile();

        const selectedPrescription = prescriptions.find(({ id }) => id === body.prescriptionId);
        const selectedPrescriptionItem = selectedPrescription?.meds.find(
            ({ id }) => id === body.itemId
        );

        if (!selectedPrescription || !selectedPrescriptionItem) {
            return NextResponse.json({ error: 'Cannot find prescription' }, { status: 401 });
        }

        const newPrescription: Prescription = {
            ...selectedPrescription,
            status: 'in_progress',
            meds: selectedPrescription.meds.map((medItem) => {
                if (body.itemId === medItem.id) {
                    return {
                        ...medItem,
                        medData: {},
                        medId: body.medId,
                    };
                }

                return { ...medItem };
            }),
        };

        const newPrescriptions = prescriptions.map((prescription) => {
            if (prescription.id === selectedPrescription.id) {
                return { ...newPrescription };
            }

            return { ...prescription };
        });

        writePrescriptionsFile(newPrescriptions);

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch {
        NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
