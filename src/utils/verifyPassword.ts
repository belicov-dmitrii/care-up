import { scryptSync, timingSafeEqual } from 'crypto';

export const verifyPassword = (password: string, storedHash: string): boolean => {
    const [salt, originalHash] = storedHash.split(':');

    if (!salt || !originalHash) {
        return false;
    }

    const passwordHash = scryptSync(password, salt, 64);
    const originalHashBuffer = Buffer.from(originalHash, 'hex');

    if (passwordHash.length !== originalHashBuffer.length) {
        return false;
    }

    return timingSafeEqual(passwordHash, originalHashBuffer);
};
