export const typedObjectKeys = <T extends Record<string, unknown>>(data: T) =>
    Object.keys(data) as Array<keyof typeof data>;
