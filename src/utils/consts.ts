import { type CSSProperties } from '@mui/material';

export const DATE_FORMAT = 'DD-MM-YYYY';
export const YEAR_FIRST_DATE_FORMAT = 'YYYY-MM-DD';

export const DOT = '•';

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

export const PaperStyles: CSSProperties = {
    ...ColumnBoxStyles,
    width: '100%',
    padding: 3,
    borderRadius: '14px',
};
