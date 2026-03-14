import { PALETTE } from '@/utils/theme/colors';
import { Box } from '@mui/material';
import { type FC } from 'react';

interface IProps {
    onClick?: () => void;
}

export const AddButton: FC<IProps> = ({ onClick }) => {
    return (
        <Box
            onClick={onClick}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '44px',
                height: '44px',
                color: '#FFF',
                background: PALETTE.ICON_DARK_GREEN,
                fontSize: '34px',
                lineHeight: '44px',
                userSelect: 'none',
                borderRadius: '50%',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
            }}
        >
            <span style={{ lineHeight: 0, position: 'relative', top: '-2px' }}>+</span>
        </Box>
    );
};
