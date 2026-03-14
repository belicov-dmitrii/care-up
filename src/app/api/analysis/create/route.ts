import { after } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { type AnalysisItem, type Analysis } from '@/types';
import { AnalysisItemPool } from '@/utils/mocks/analysis';
import { sleep } from '@/utils/sleep';
import moment from 'moment';
import { DATE_FORMAT } from '@/utils/consts';

export const dynamic = 'force-dynamic';

const DATA_DIR = path.join(process.cwd(), 'data');
const ANALYSIS_FILE = path.join(DATA_DIR, 'analysis.json');

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
        await fs.access(ANALYSIS_FILE);
    } catch {
        await fs.writeFile(ANALYSIS_FILE, '[]', 'utf-8');
    }
}

async function readAnalysisFile(): Promise<Array<Analysis>> {
    await ensureDataFile();

    try {
        const raw = await fs.readFile(ANALYSIS_FILE, 'utf-8');
        const parsed = JSON.parse(raw);

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

async function writeAnalysisFile(data: Array<Analysis>): Promise<void> {
    await ensureDataFile();
    await fs.writeFile(ANALYSIS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function getFakeAnalysisItems(): Array<AnalysisItem> {
    const shuffled = [...AnalysisItemPool].sort(() => Math.random() - 0.5);
    const count = Math.floor(Math.random() * 3) + 3; // 3..5 items
    const selected = shuffled.slice(0, count);

    return selected.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
    }));
}

function getAnalysisSeverity(items: Array<AnalysisItem>): Analysis['severity'] {
    if (items.some((item) => item.severity === 'critical')) {
        return 'red';
    }

    if (items.some((item) => item.severity === 'attention')) {
        return 'yellow';
    }

    return 'green';
}

async function finalizeAnalysis(analysisId: string): Promise<void> {
    await sleep(60 * 1000);

    const items = getFakeAnalysisItems();
    const analysisList = await readAnalysisFile();

    const nextList = analysisList.map((analysis) => {
        if (analysis.id !== analysisId) {
            return analysis;
        }

        return {
            ...analysis,
            status: 'completed' as const,
            severity: getAnalysisSeverity(items),
            items,
        };
    });

    await writeAnalysisFile(nextList);
}

export async function POST(req: Request) {
    try {
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

        const newAnalysis: Analysis = {
            id: crypto.randomUUID(),
            date: moment().format(DATE_FORMAT),
            status: 'processing',
            severity: 'yellow',
            items: [],
        };

        const analysisList = await readAnalysisFile();
        analysisList.unshift(newAnalysis);
        await writeAnalysisFile(analysisList);

        after(async () => {
            try {
                await finalizeAnalysis(newAnalysis.id);
            } catch (error) {
                console.error('Failed to finalize analysis:', error);
            }
        });

        return Response.json({
            ok: true,
            data: newAnalysis,
        });
    } catch (error) {
        console.error('Failed to create analysis:', error);

        return Response.json(
            {
                ok: false,
                message: 'Failed to create analysis.',
            },
            { status: 500 }
        );
    }
}
