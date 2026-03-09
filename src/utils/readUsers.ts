import { promises as fs } from 'fs';
import path from 'path';
import { type UserData } from '@/types';

const dataPath = (...p: string[]) => path.join(process.cwd(), 'data', ...p);

export const readUsers = async () => {
    const file = await fs.readFile(dataPath('users.json'), 'utf-8');
    const users: Array<UserData & { password: string; token: string }> = JSON.parse(file);

    return users;
};
