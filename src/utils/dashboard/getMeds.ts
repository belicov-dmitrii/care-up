import { getServerAPI } from '../getServerAPI';
import { NetworkRequest } from '../NetworkRequest';

export const getMeds = async () => {
    const { link, params } = await getServerAPI('/meds');

    const { data, ok } = await NetworkRequest(link, {}, { method: 'POST', ...params });

    if (!ok) {
        return [];
    }

    return data;
};
