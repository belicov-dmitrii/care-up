import { logError } from './logError';

const BASE_PARAMS = {
    method: 'GET',
};

export const NetworkRequest = async <T>(
    url: string,
    reqBody: Record<string, unknown>,
    params: Parameters<typeof fetch>[1] = BASE_PARAMS
) => {
    const isServerLink = url.startsWith('http://') || url.startsWith('https://');

    try {
        const finalParams = { ...(params || {}) };

        if (finalParams.method !== 'GET') {
            finalParams.body = JSON.stringify(reqBody);
        }

        const res = await fetch(isServerLink ? url : `/api/${url}`, finalParams);

        const body = await res.json();

        return { data: body as T, ok: true };
    } catch (error) {
        logError('fetch failed', error);

        return { data: {} as T, ok: false };
    }
};
