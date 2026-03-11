import { type IntakeEvent } from '@/types';
import { type FC, memo } from 'react';
import { Box } from '@mui/material';
import { PALETTE } from '@/utils/theme/colors';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import DoDisturbAltRoundedIcon from '@mui/icons-material/DoDisturbAltRounded';
import PanoramaFishEyeRoundedIcon from '@mui/icons-material/PanoramaFishEyeRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

export const EventStatus: FC<{ status?: IntakeEvent['status'] }> = memo(({ status }) => {
    switch (status) {
        case 'taken':
            return (
                <Box sx={{ color: PALETTE.TEXT_SUCCESS }}>
                    <CheckCircleOutlineRoundedIcon color="inherit" />
                </Box>
            );
        case 'skipped':
            return (
                <Box sx={{ color: PALETTE.ICON_PURPLE }}>
                    <DoDisturbAltRoundedIcon color="inherit" />
                </Box>
            );
        case 'missed':
            return (
                <Box sx={{ color: PALETTE.ERROR }}>
                    <CancelRoundedIcon color="inherit" />
                </Box>
            );
        default:
            return (
                <Box sx={{ color: PALETTE.TEXT_SECONDARY }}>
                    <PanoramaFishEyeRoundedIcon color="inherit" />
                </Box>
            );
    }
});
