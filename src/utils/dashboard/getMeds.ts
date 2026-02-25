import { type Med } from '@/types';
import { getServerAPI } from '../getServerAPI';
import { NetworkRequest } from '../NetworkRequest';

export const getMeds = async (): Promise<Array<Med>> => {
    const { link, params } = await getServerAPI('/meds');

    const { data, ok } = await NetworkRequest<Array<Med>>(link, {}, { method: 'POST', ...params });

    if (!ok) {
        return [];
    }

    return data;
};
