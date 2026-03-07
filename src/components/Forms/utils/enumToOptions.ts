import { typedObjectKeys } from '@/utils/typedObjectKeys';

export const enumToOptions = <T extends Record<string, string>>(obj: T) => {
    return typedObjectKeys(obj).map((key) => {
        return {
            value: key,
            display: obj[key],
        };
    });
};
