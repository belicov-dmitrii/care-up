import { getUserDataByToken } from '@/utils/getUserDataByToken';
import { type NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '../../login/route';
import { readUsers } from '@/utils/readUsers';
import { hashPassword, writeUsers } from '../../register-user/route';

export async function POST(request: NextRequest) {
    try {
        const userId = (await getUserDataByToken(request.cookies.get(AUTH_COOKIE_NAME)?.value))?.id;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        const users = await readUsers();

        const selectedUser = users.find(({ id }) => id === userId);

        if (!selectedUser) {
            return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
        }

        selectedUser.password = hashPassword(body.password);

        const newUsers = users.map((user) => {
            if (user.id === selectedUser.id) {
                return selectedUser;
            }

            return user;
        });

        await writeUsers(newUsers);

        return NextResponse.json({ error: 'Password has changed' }, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
