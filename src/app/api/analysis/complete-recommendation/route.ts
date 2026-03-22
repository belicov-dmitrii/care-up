import { getUserDataByToken } from '@/utils/getUserDataByToken';
import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '../../login/route';
import { promises as fs } from 'fs';
import path from 'path';
import { type Analysis } from '@/types';
import { writeAnalysisFile } from '../create/route';

const dataPath = (...p: string[]) => path.join(process.cwd(), 'data', ...p);

export async function POST(req: NextRequest) {
    try {
        const userId = (await getUserDataByToken(req.cookies.get(AUTH_COOKIE_NAME)?.value))?.id;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        const filePath = dataPath('analysis.json');

        const file = await fs.readFile(filePath, 'utf-8');

        const analysis: Analysis[] = JSON.parse(file);

        const selectedAnalysis: Analysis | undefined = analysis.find(
            (analysis) => analysis.userId === userId && analysis.id === body.analysisId
        );

        const selectedAnalysisItem: Analysis['items'][number] | undefined =
            selectedAnalysis?.items?.find((item) => item.id === body.itemId);

        if (!selectedAnalysis || !selectedAnalysisItem) {
            return NextResponse.json({ error: 'Cannot find the analysis' }, { status: 401 });
        }

        selectedAnalysisItem.recommendations[body.recommendationIndex] = {
            ...selectedAnalysisItem.recommendations[body.recommendationIndex],
            status: 'ready',
        };

        if (selectedAnalysisItem.recommendations.every(({ status }) => status === 'ready')) {
            selectedAnalysisItem.status = 'reviewed';
        }

        const newAnalysis: Analysis = {
            ...selectedAnalysis,
            items: selectedAnalysis.items.map((item) => {
                if (body.itemId === item.id) {
                    return {
                        ...selectedAnalysisItem,
                    };
                }

                return { ...item };
            }),
        };

        const newAnalysises = analysis.map((analysisKey) => {
            if (analysisKey.id === newAnalysis.id) {
                return { ...newAnalysis };
            }

            return { ...analysisKey };
        });

        writeAnalysisFile(newAnalysises);

        return NextResponse.json({ msg: 'Sucess' }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to got analysis' }, { status: 500 });
    }
}
