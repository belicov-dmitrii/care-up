import { type FC } from 'react';
import { PALETTE } from '@/utils/theme/colors';
import { Box, Stack, Typography } from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import { RowBoxStyles } from '@/utils/consts';
import { getServerT } from '@/i18n';

interface IDashboardHeaderProps {
    schedulesCount: number;
}

export const DashboardHeader: FC<IDashboardHeaderProps> = async ({ schedulesCount }) => {
    const t = await getServerT();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Stack gap={1}>
                <Typography variant="h1" fontWeight={600} sx={{ ...RowBoxStyles }}>
                    {t('good-afternoon')} <SpaIcon />
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ fontSize: 16, ml: 0.5, color: PALETTE.BRAND_GREY }}
                >
                    {schedulesCount === 1
                        ? t('today-thing')
                        : t('today-things', { count: schedulesCount })}
                </Typography>
            </Stack>
        </Box>
    );
};
