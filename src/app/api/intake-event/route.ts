import { promises as fs } from 'fs';
import path from 'path';
import { type NextRequest, NextResponse } from 'next/server';
import { type SymptomsType } from '@/types';
import { Symptoms } from "@/utils/consts";
import { getUserDataByToken } from '@/utils/getUserDataByToken';
import { AUTH_COOKIE_NAME } from '../login/route';

export type IntakeEventStatus = 'taken' | 'missed' | 'skipped';

export interface IntakeEvent {
    id: string;
    userId: string;
    medId: string;
    medName: string;
    time: string;
    medStrenght: string;
    scheduleId: string;
    scheduleTimeId: string;
    eventDate: string;
    status: IntakeEventStatus;
    symptoms: Array<SymptomsType>;
    createdAt: string;
    updatedAt: string | null;
}

type CreateIntakeEventPayload = Omit<IntakeEvent, 'userId' | 'createdAt' | 'updatedAt'>;

type UpdateIntakeEventPayload = Partial<
    Omit<IntakeEvent, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
> & {
    id: string;
};

const dataPath = path.join(process.cwd(), 'data', 'intake-events.json');

const allowedStatuses: IntakeEventStatus[] = ['taken', 'missed', 'skipped'];

const isObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const isValidSymptoms = (value: unknown): value is Array<SymptomsType> => {
    return Array.isArray(value) && value.every((item) => Symptoms.includes(item as SymptomsType));
};

const isValidStatus = (value: unknown): value is IntakeEventStatus => {
    return typeof value === 'string' && allowedStatuses.includes(value as IntakeEventStatus);
};

const ensureFileExists = async () => {
    try {
        await fs.access(dataPath);
    } catch {
        await fs.mkdir(path.dirname(dataPath), { recursive: true });
        await fs.writeFile(dataPath, '[]', 'utf-8');
    }
};

const readIntakeEvents = async (): Promise<Array<IntakeEvent>> => {
    await ensureFileExists();

    const file = await fs.readFile(dataPath, 'utf-8');

    try {
        const parsed = JSON.parse(file);

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const writeIntakeEvents = async (events: Array<IntakeEvent>) => {
    await fs.writeFile(dataPath, JSON.stringify(events, null, 4), 'utf-8');
};

const validateCreatePayload = (body: unknown): body is CreateIntakeEventPayload => {
    if (!isObject(body)) {
        return false;
    }

    return (
        typeof body.id === 'string' &&
        typeof body.medId === 'string' &&
        typeof body.medName === 'string' &&
        typeof body.time === 'string' &&
        typeof body.medStrenght === 'string' &&
        typeof body.scheduleId === 'string' &&
        typeof body.scheduleTimeId === 'string' &&
        typeof body.eventDate === 'string' &&
        isValidStatus(body.status) &&
        isValidSymptoms(body.symptoms)
    );
};

const validatePatchPayload = (body: unknown): body is UpdateIntakeEventPayload => {
    if (!isObject(body) || typeof body.id !== 'string') {
        return false;
    }

    if ('status' in body && !isValidStatus(body.status)) {
        return false;
    }

    if ('symptoms' in body && !isValidSymptoms(body.symptoms)) {
        return false;
    }

    return true;
};

export async function GET(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Event id is required' }, { status: 400 });
        }

        const events = await readIntakeEvents();
        const event = events.find((item) => item.id === id);

        if (!event) {
            return NextResponse.json({ error: 'Intake event not found' }, { status: 404 });
        }

        return NextResponse.json(event);
    } catch {
        return NextResponse.json({ error: 'Failed to read intake event' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const userId = getUserDataByToken(req.cookies.get(AUTH_COOKIE_NAME)?.value)?.id;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body: unknown = await req.json();

        if (!validateCreatePayload(body)) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const events = await readIntakeEvents();

        const now = new Date().toISOString();

        const newEvent: IntakeEvent = {
            id: body.id,
            userId,
            medId: body.medId,
            medName: body.medName,
            time: body.time,
            medStrenght: body.medStrenght,
            scheduleId: body.scheduleId,
            scheduleTimeId: body.scheduleTimeId,
            eventDate: body.eventDate,
            status: body.status,
            symptoms: body.symptoms,
            createdAt: now,
            updatedAt: null,
        };

        events.push(newEvent);

        await writeIntakeEvents(events);

        return NextResponse.json(newEvent, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to create intake event' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body: unknown = await req.json();

        if (!validatePatchPayload(body)) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const events = await readIntakeEvents();
        const eventIndex = events.findIndex((item) => item.id === body.id);

        if (eventIndex === -1) {
            return NextResponse.json({ error: 'Intake event not found' }, { status: 404 });
        }

        const currentEvent = events[eventIndex];

        const updatedEvent: IntakeEvent = {
            ...currentEvent,
            ...(body.medId !== undefined ? { medId: body.medId as string } : {}),
            ...(body.medName !== undefined ? { medName: body.medName as string } : {}),
            ...(body.time !== undefined ? { time: body.time as string } : {}),
            ...(body.medStrenght !== undefined ? { medStrenght: body.medStrenght as string } : {}),
            ...(body.scheduleId !== undefined ? { scheduleId: body.scheduleId as string } : {}),
            ...(body.scheduleTimeId !== undefined
                ? { scheduleTimeId: body.scheduleTimeId as string }
                : {}),
            ...(body.eventDate !== undefined ? { eventDate: body.eventDate as string } : {}),
            ...(body.status !== undefined ? { status: body.status } : {}),
            ...(body.symptoms !== undefined ? { symptoms: body.symptoms } : {}),
            updatedAt: new Date().toISOString(),
        };

        events[eventIndex] = updatedEvent;

        await writeIntakeEvents(events);

        return NextResponse.json(updatedEvent);
    } catch {
        return NextResponse.json({ error: 'Failed to update intake event' }, { status: 500 });
    }
}
