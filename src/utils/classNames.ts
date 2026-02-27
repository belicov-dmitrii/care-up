export const classNames = (...args: Array<string | boolean>) => {
    const strings = args.filter((item) => typeof item === 'string');

    return strings.join(' ');
};
