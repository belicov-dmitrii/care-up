import { headers } from 'next/headers';
import { cookies } from 'next/headers';

export const getServerAPI = async (url: string) => {
    const h = await headers();
    const cookie = await cookies();

    const host = h.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'http';

    return {
        link: `${protocol}://${host}/api/${url}`,
        params: {
            next: { revalidate: 60 },
            headers: { cookie: cookie.toString() },
        },
    };
};
