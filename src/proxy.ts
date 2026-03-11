import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/api/login', '/registration', '/api/register-user'];

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

    if (
        pathname.startsWith('/_next') ||
        pathname === '/favicon.ico' ||
        pathname.startsWith('/icons') ||
        pathname.startsWith('/image') ||
        pathname.startsWith('/apple-touch-icon') ||
        pathname.startsWith('/site.webmanifest')
    ) {
        return NextResponse.next();
    }

    const token = req.cookies.get('auth_token')?.value;

    if (!token) {
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = req.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('next', pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
