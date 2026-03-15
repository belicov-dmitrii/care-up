import { type CreateScheduleBody, type ScheduleItem } from '@/types';
import { getUserDataByToken } from '@/utils/getUserDataByToken';
import { promises as fs } from 'fs';
import { type NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { AUTH_COOKIE_NAME } from '../login/route';
import moment from 'moment';
import { YEAR_FIRST_DATE_FORMAT } from '@/utils/consts';
import { isValidCreateScheduleBody as isValidBody } from '@/utils/typeGuards';

const dataPath = (...p: string[]) => path.join(process.cwd(), 'data', ...p);

function isValidCreateScheduleBody(body: unknown): body is CreateScheduleBody {
    if (!body || typeof body !== 'object') {
        return false;
    }

    const candidate = body as Record<string, unknown>;

    return isValidBody(candidate);
}

export async function POST(req: NextRequest) {
    try {
        const userId = (await getUserDataByToken(req.cookies.get(AUTH_COOKIE_NAME)?.value))?.id;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        if (!isValidCreateScheduleBody(body)) {
            return NextResponse.json({ error: 'Invalid schedule data' }, { status: 400 });
        }

        const filePath = dataPath('schedule.json');

        const file = await fs.readFile(filePath, 'utf-8');
        const schedules: ScheduleItem[] = JSON.parse(file);

        const newSchedule: ScheduleItem = {
            id: crypto.randomUUID(),
            userId,
            medId: body.medId,
            type: body.type,
            dose: body.dose,
            time: body.time,
            startDate: moment().format(YEAR_FIRST_DATE_FORMAT),
            endDate: body.endDate,
            recommendations: [],
            restriction: [],
        };

        schedules.push(newSchedule);

        await fs.writeFile(filePath, JSON.stringify(schedules, null, 4), 'utf-8');

        return NextResponse.json(newSchedule, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
    }
}
