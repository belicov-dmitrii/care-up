import { type IntakeEvent } from '@/types';
import { getServerAPI } from '../getServerAPI';
import { NetworkRequest } from '../NetworkRequest';

export const getIntakeEvent = async (id: string) => {
    const { link, params } = await getServerAPI(`intake-event?id=${id}`);

    const { data, ok } = await NetworkRequest<IntakeEvent>(link, {}, { method: 'GET', ...params });

    if (!ok) {
        return null;
    }

    return data;
};
