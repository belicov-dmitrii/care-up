import { profileSchema, type UserToSend } from '@/components/Profile/utils/steps';
import { getUserDataByToken } from '@/utils/getUserDataByToken';
import { readUsers } from '@/utils/readUsers';
import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '../../login/route';
import { writeUsers } from '../../register-user/route';
import * as Yup from 'yup';

export async function POST(request: NextRequest) {
    try {
        const userId = (await getUserDataByToken(request.cookies.get(AUTH_COOKIE_NAME)?.value))?.id;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = (await request.json()) as UserToSend;

        const validatedData = await profileSchema.validate(body, {
            abortEarly: false,
            stripUnknown: true,
        });

        const users = await readUsers();

        const selectedUser = users.find(({ id }) => id === userId);

        if (!selectedUser) {
            return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
        }

        const newUser = {
            ...selectedUser,
            ...validatedData,
            allergies: (validatedData.allergies ?? [])
                .map((item) => item?.trim() ?? '')
                .filter(Boolean),
            diseases: (validatedData.diseases ?? [])
                .map((item) => item?.trim() ?? '')
                .filter(Boolean),
        };

        const newUsers = users.map((user) => {
            if (user.id === selectedUser.id) {
                return newUser;
            }

            return user;
        });

        await writeUsers(newUsers);

        const response = NextResponse.json(
            {
                message: 'User updated successfully',
            },
            { status: 201 }
        );

        return response;
    } catch (error) {
        if (error instanceof Yup.ValidationError) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    fields: error.inner.map((item) => ({
                        field: item.path,
                        message: item.message,
                    })),
                },
                { status: 400 }
            );
        }

        console.error('Create user error:', error);

        return NextResponse.json(
            {
                error: 'Failed to create user',
            },
            { status: 500 }
        );
    }
}
