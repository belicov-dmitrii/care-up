import { MOCK_USER_DATA } from '@/app/api/login/route';
import { type UserData } from '@/types';

export const getUserDataByToken = (token: string | undefined): UserData | null => {
    if (!token) {
        return null;
    }

    return { ...MOCK_USER_DATA };
};
