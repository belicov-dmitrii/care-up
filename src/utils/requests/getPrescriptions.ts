import { type Prescription } from '@/types';
import { getServerAPI } from '../getServerAPI';
import { NetworkRequest } from '../NetworkRequest';

export async function getPrescriptions(id: string): Promise<Prescription | undefined>;
export async function getPrescriptions(): Promise<Array<Prescription>>;

export async function getPrescriptions(
    id?: string
): Promise<Array<Prescription> | Prescription | undefined> {
    const { link, params } = await getServerAPI('/prescriptions');

    if (id) {
        const { data, ok } = await NetworkRequest<Prescription | undefined>(
            link,
            { id },
            { method: 'POST', ...params }
        );

        return ok ? data : undefined;
    }

    const { data, ok } = await NetworkRequest<Array<Prescription>>(
        link,
        {},
        { method: 'POST', ...params }
    );

    return ok ? data : [];
}
