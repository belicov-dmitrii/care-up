import { type ScheduleItem } from '@/types';
import { getServerAPI } from '../getServerAPI';
import { NetworkRequest } from '../NetworkRequest';

export const getSchedule = async (): Promise<Array<ScheduleItem>> => {
    const { link, params } = await getServerAPI('/schedule');

    const { data, ok } = await NetworkRequest<Array<ScheduleItem>>(
        link,
        {},
        { method: 'POST', ...params }
    );

    if (!ok) {
        return [];
    }

    return data;
};
