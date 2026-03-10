import { type CSSProperties } from '@mui/material';

export const DATE_FORMAT = 'DD-MM-YYYY';
export const YEAR_FIRST_DATE_FORMAT = 'YYYY-MM-DD';

export const DOT = '•';

export const formFloatingAnimation = {
    enter: (direction: 'forward' | 'backward') => ({
        x: direction === 'forward' ? 500 : -500,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: 'forward' | 'backward') => ({
        x: direction === 'forward' ? -500 : 500,
    }),
};

export const ColumnBoxStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
};

export const RowBoxStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
};
