import { type AnalysisItem } from '@/types';
import { PALETTE } from '@/utils/theme/colors';
import { alpha } from '@mui/material';
import { type ReactElement } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DataSaverOffIcon from '@mui/icons-material/DataSaverOff';
import { ConsultIcon } from '@/components/icons/ConsultIcon';
import { PillIcon } from '@/components/icons/PillIcon';
import { AnalysisIcon } from '@/components/icons/AnalysisIcon';

export const ANALYSIS_ITEM_STYLES: Record<
    AnalysisItem['status'],
    Record<'text' | 'container' | 'title', string> & { icon: ReactElement }
> = {
    optimal: {
        text: PALETTE.SUCCESS,
        container: alpha(PALETTE.SUCCESS, 0.15),
        title: 'Optimal',
        icon: <DataSaverOffIcon />,
    },
    processing: {
        text: PALETTE.ICON_YELLOW,
        container: PALETTE.ICON_CONTAINER_YELLOW,
        title: 'Processing',
        icon: <CloudUploadIcon />,
    },
    requiresAction: {
        text: PALETTE.ERROR,
        container: alpha(PALETTE.ERROR, 0.15),
        title: 'Requires action',
        icon: <ReportProblemIcon />,
    },
    reviewed: {
        text: PALETTE.ICON_DARK_GREEN,
        container: PALETTE.ICON_CONTAINER_DARK_GREEN,
        title: 'Completed',
        icon: <CheckIcon />,
    },
};

export const ANALYSIS_ITEM_RECOMMENDATIONS_STYLES = {
    consult: {
        text: PALETTE.SUCCESS,
        container: alpha(PALETTE.SUCCESS, 0.15),
        icon: <ConsultIcon />,
        action: 'notificationDoctor',
        title: 'Create a reminder',
    },
    medication: {
        text: PALETTE.ICON_YELLOW,
        container: PALETTE.ICON_CONTAINER_YELLOW,
        icon: <PillIcon />,
        action: 'linkToPharmacy',
        title: 'Add Medication',
    },
    notification: {
        text: PALETTE.ICON_PURPLE,
        container: PALETTE.BUTTON_BG_LAVANDER,
        icon: <AnalysisIcon />,
        action: 'notificationRepeatTest',
        title: 'Set a reminder',
    },
} as const;
