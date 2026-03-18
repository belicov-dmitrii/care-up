import { AnalysisIcon } from '@/components/icons/AnalysisIcon';
import { PillIcon } from '@/components/icons/PillIcon';
import { PALETTE } from '@/utils/theme/colors';
import { Box } from '@mui/material';
import { type FC } from 'react';
import MedicationIcon from '@mui/icons-material/Medication';

interface IProps {
    color?: number;
    icon?: number;
}

const ICONS = [
    <PillIcon key="pill" />,
    <AnalysisIcon key="analysis" />,
    <MedicationIcon key="pill" />,
];
const COLORS = [
    { background: PALETTE.ICON_CONTAINER_DARK_GREEN, color: PALETTE.ICON_DARK_GREEN },
    { background: PALETTE.ICON_CONTAINER_YELLOW, color: PALETTE.ICON_YELLOW },
    { background: PALETTE.BUTTON_BG_LAVANDER, color: PALETTE.ICON_PURPLE },
];

export const RandomPrescriptionIcon: FC<IProps> = ({ color, icon }) => {
    const colors = COLORS[color ?? 2];

    return (
        <Box
            sx={{
                background: colors.background,
                color: colors.color,
                p: 1.5,
                borderRadius: '50px',
                fontSize: '25px',
                ...(icon ? {} : { width: '49px', height: '49px' }),
            }}
        >
            {typeof icon !== 'undefined' ? ICONS[icon] : null}
        </Box>
    );
};
