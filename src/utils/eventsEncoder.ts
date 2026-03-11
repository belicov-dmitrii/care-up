export const encodeIdWithDate = (id: string, date: string) => {
    const raw = `${id}|${date}`;

    return Buffer.from(raw)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

export const decodeIdWithDate = (token: string) => {
    const base64 = token.replace(/-/g, '+').replace(/_/g, '/');

    const decoded = Buffer.from(base64, 'base64').toString();

    const [id, date] = decoded.split('|');

    return { id, date };
};
