import { type IntakeEvent } from '@/types';
import { getServerAPI } from '../getServerAPI';
import { NetworkRequest } from '../NetworkRequest';

export const getTodayEvents = async (
    startDate: string,
    endDate: string
): Promise<Record<string, IntakeEvent>> => {
    const { link, params } = await getServerAPI('/get-events');

    const { data, ok } = await NetworkRequest<Record<string, IntakeEvent>>(
        link,
        {
            startDate,
            endDate,
        },
        { method: 'POST', ...params }
    );

    if (!ok) {
        return {};
    }

    return data;
};
