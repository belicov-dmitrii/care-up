import { type IntakeEvent } from '@/types';
import { promises as fs } from 'fs';
import { type NextRequest, NextResponse } from 'next/server';
import path from 'path';

const dataPath = (...p: string[]) => path.join(process.cwd(), 'data', ...p);

function parseDate(date: string) {
    const [d, m, y] = date.split('-').map(Number);
    return new Date(y, m - 1, d);
}

export async function POST(req: NextRequest) {
    try {
        const { startDate, endDate } = await req.json();

        if (!startDate || !endDate) {
            return NextResponse.json(
                { error: 'startDate and endDate are required' },
                { status: 400 }
            );
        }

        const start = parseDate(startDate);
        const end = parseDate(endDate);

        const file = await fs.readFile(dataPath('intake-events.json'), 'utf-8');
        const events = JSON.parse(file);

        const result: Record<string, IntakeEvent> = {};

        for (const event of events) {
            const eventDate = parseDate(event.eventDate);

            if (eventDate >= start && eventDate <= end) {
                result[event.id] = event;
            }
        }

        return NextResponse.json(result);
    } catch (_) {
        return NextResponse.json({ error: 'Failed to load intake events' }, { status: 500 });
    }
}
