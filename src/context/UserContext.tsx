'use client';

import { ILoginResponse } from '@/components/LoginForm/utils/types';
import { NetworkRequest } from '@/utils.ts/NetworkRequest';
import { noop } from '@/utils.ts/noop';
import { redirect } from 'next/navigation';
import {
    createContext,
    FC,
    memo,
    PropsWithChildren,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';

interface IUserContext {
    userData: ILoginResponse | null;
    changeUserData: (userData: ILoginResponse | null) => void;
    logout: () => void;
}

const defaultValue: IUserContext = {
    userData: null,
    changeUserData: noop,
    logout: noop,
};

const UserContext = createContext<IUserContext>(defaultValue);

export const UserContextProvider: FC<PropsWithChildren> = memo(({ children }) => {
    const [userData, setUserData] = useState<ILoginResponse | null>(null);

    const changeUserData = useCallback((userData: ILoginResponse | null) => {
        setUserData(userData);
    }, []);

    const logout = useCallback(async () => {
        const { ok } = await NetworkRequest('/logout', {}, { method: 'POST' });

        if (ok) {
            setUserData(null);

            redirect('/login');
        }
    }, []);

    const value = useMemo(() => {
        return {
            userData,
            logout,
            changeUserData,
        };
    }, [changeUserData, logout, userData]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
});

export const useUserContext = () => {
    const ctx = useContext(UserContext);

    if (!ctx) {
        throw new Error('Please wrap your component in UserContext');
    }

    return ctx;
};
