import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID, scryptSync } from 'crypto';
import * as Yup from 'yup';
import { type NextRequest, NextResponse } from 'next/server';
import { type UserData } from '@/types';
import { type NewUserDataType } from '@/components/Registration/utils/types';
import { AUTH_COOKIE_NAME } from '../login/route';
import { registrationValidationSchema } from '@/components/Registration/utils/registrationValidationSchema';

const dataPath = (...parts: string[]) => path.join(process.cwd(), 'data', ...parts);
const usersFilePath = dataPath('users.json');

const ensureDataFileExists = async () => {
    await fs.mkdir(dataPath(), { recursive: true });

    try {
        await fs.access(usersFilePath);
    } catch {
        await fs.writeFile(usersFilePath, '[]', 'utf-8');
    }
};

const readUsers = async (): Promise<UserData[]> => {
    await ensureDataFileExists();

    const file = await fs.readFile(usersFilePath, 'utf-8');

    try {
        const parsed = JSON.parse(file);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const writeUsers = async (users: UserData[]) => {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 4), 'utf-8');
};

const hashPassword = (password: string): string => {
    const salt = randomUUID();
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
};

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as NewUserDataType;

        const validatedData = await registrationValidationSchema.validate(body, {
            abortEarly: false,
            stripUnknown: true,
        });

        const users = await readUsers();

        const normalizedEmail = validatedData.email.trim().toLowerCase();

        const existingUser = users.find(
            (user) => user.email.trim().toLowerCase() === normalizedEmail
        );

        if (existingUser) {
            return NextResponse.json(
                {
                    error: 'User with this email already exists',
                    field: 'email',
                },
                { status: 409 }
            );
        }

        const now = new Date().toISOString();
        const token = randomUUID();

        const newUser: UserData & {
            createdAt: string;
            updatedAt: string;
            password: string;
            token: string;
        } = {
            id: randomUUID(),
            token,
            name: validatedData.name.trim(),
            email: normalizedEmail,
            password: hashPassword(validatedData.password),
            sex: validatedData.sex,
            age: validatedData.age,
            height: validatedData.height,
            weight: validatedData.weight,
            pregnant: Boolean(validatedData.pregnant),
            breastfeeding: Boolean(validatedData.breastfeeding),
            smoking: Boolean(validatedData.smoking),
            drinking: Boolean(validatedData.drinking),
            allergies: (validatedData.allergies ?? [])
                .map((item) => item?.trim() ?? '')
                .filter(Boolean),
            diseases: (validatedData.diseases ?? [])
                .map((item) => item?.trim() ?? '')
                .filter(Boolean),
            createdAt: now,
            updatedAt: now,
        };

        users.push(newUser);
        await writeUsers(users);

        const response = NextResponse.json(
            {
                message: 'User created successfully',
            },
            { status: 201 }
        );

        response.cookies.set({
            name: AUTH_COOKIE_NAME,
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24,
        });

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
