import { type Analysis } from '@/types';
import { PALETTE } from '@/utils/theme/colors';
import { alpha, Box } from '@mui/material';
import { type FC, memo } from 'react';

type StatusType = Analysis['status'] | 'in_progress';

const DOC_STATUS: Record<StatusType, Record<'text' | 'container' | 'title', string>> = {
    completed: {
        text: PALETTE.SUCCESS,
        container: alpha(PALETTE.SUCCESS, 0.15),
        title: 'Completed',
    },
    processing: {
        text: PALETTE.ICON_DARK_GREEN,
        container: PALETTE.ICON_CONTAINER_DARK_GREEN,
        title: 'Processing',
    },
    recognized: {
        text: PALETTE.ICON_YELLOW,
        container: PALETTE.ICON_CONTAINER_YELLOW,
        title: 'Recognized',
    },
    in_progress: {
        text: PALETTE.ICON_DARK_GREEN,
        container: PALETTE.ICON_CONTAINER_DARK_GREEN,
        title: 'In Progress',
    },
};

export const DocsStatus: FC<{ status: StatusType }> = memo(({ status }) => {
    const statusProps = DOC_STATUS[status];

    return (
        <Box
            sx={{
                background: statusProps.container,
                display: 'inline-block',
                color: statusProps.text,
                p: '4px 10px',
                borderRadius: '20px',
                fontSize: '12px',
            }}
        >
            {statusProps.title}
        </Box>
    );
});
