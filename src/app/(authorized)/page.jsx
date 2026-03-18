import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function MainPage() {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('auth_token')?.value;

    if (!cookieToken) {
        redirect('/login');
    }

    redirect('/dashboard');
}
