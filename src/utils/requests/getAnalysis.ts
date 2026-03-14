import { type Analysis } from '@/types';
import { getServerAPI } from '../getServerAPI';
import { NetworkRequest } from '../NetworkRequest';

export async function getAnalysis(id: string): Promise<Analysis | undefined>;
export async function getAnalysis(): Promise<Array<Analysis>>;

export async function getAnalysis(id?: string): Promise<Array<Analysis> | Analysis | undefined> {
    const { link, params } = await getServerAPI('/analysis');

    if (id) {
        const { data, ok } = await NetworkRequest<Array<Analysis>>(
            link,
            { id },
            { method: 'POST', ...params }
        );

        return ok ? data : [];
    }

    const { data, ok } = await NetworkRequest<Analysis | undefined>(
        link,
        {},
        { method: 'POST', ...params }
    );

    return ok ? data : undefined;
}
