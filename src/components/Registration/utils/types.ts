import { type UserData } from '@/types';

export type NewUserDataType = Omit<UserData, 'id' | 'age' | 'weight' | 'height'> &
    Record<'age' | 'weight' | 'height' | 'password' | 'confirmPassword', string>;
