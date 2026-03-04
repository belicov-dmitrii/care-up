'use client';

import { memo, type FC } from 'react';
import { PALETTE } from '@/utils/theme/colors';
import { Box, Stack, Typography, Avatar } from '@mui/material';
import { useI18n } from '../I18nProvider';
import SpaIcon from '@mui/icons-material/Spa';

interface IDashboardHeaderProps {
    schedulesCount: number;
}

export const DashboardHeader: FC<IDashboardHeaderProps> = memo(({ schedulesCount }) => {
    const { t } = useI18n();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Stack gap={1}>
                <Typography variant="h1" sx={{ fontSize: 28, fontWeight: 600 }}>
                    {t('good-afternoon')} <SpaIcon />
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 14, color: PALETTE.BRAND_GREY }}>
                    {t('today-things', { count: schedulesCount })}
                </Typography>
            </Stack>
            <Avatar src="/care-logo.png" sx={{ width: 48, height: 48 }} />
        </Box>
    );
});
