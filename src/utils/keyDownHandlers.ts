import { type KeyboardEvent } from 'react';

export const handleDecimalNumberKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const allowedControlKeys = [
        'Backspace',
        'Delete',
        'ArrowLeft',
        'ArrowRight',
        'Tab',
        'Home',
        'End',
    ];

    if (allowedControlKeys.includes(e.key)) {
        return;
    }

    const input = e.currentTarget;
    const value = input.value;
    const selectionStart = input.selectionStart ?? 0;
    const selectionEnd = input.selectionEnd ?? 0;

    const nextValue = value.slice(0, selectionStart) + e.key + value.slice(selectionEnd);

    const validPattern = /^\d*(\.\d{0,2})?$/;

    if (!validPattern.test(nextValue) || nextValue.length > 5) {
        e.preventDefault();
    }
};

export const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedControlKeys = [
        'Backspace',
        'Delete',
        'Tab',
        'ArrowLeft',
        'ArrowRight',
        'Home',
        'End',
    ];

    if (
        !/^\d$/.test(e.key) && // not a digit
        !allowedControlKeys.includes(e.key)
    ) {
        e.preventDefault();
    }
};
