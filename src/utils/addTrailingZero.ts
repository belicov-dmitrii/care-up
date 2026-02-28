export const addTrailingZero = (num: number) => {
    return num < 10 ? `0${num}` : `${num}`;
};

export const formatTime = (hours: number, minutes: number) => {
    return `${addTrailingZero(hours)}:${addTrailingZero(minutes)}`;
};
