import { type UserData } from '@/types';
import { readUsers } from './readUsers';

export const getUserDataByToken = async (token: string | undefined): Promise<UserData | null> => {
    if (!token) {
        return null;
    }

    const users = await readUsers();

    const selectedUser = users.find(({ token: userToken }) => token === userToken);

    if (!selectedUser) {
        return null;
    }

    const { password: _, token: _t, ...userToSend } = selectedUser;

    return userToSend;
};
