'use client';

import { type FC, memo } from 'react';
import { Paper, Stack, Chip, Typography, Button, IconButton } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { formatMedDose, formatTime } from '@/utils/formatData';
import { DOT } from '@/utils/consts';
import { PALETTE } from '@/utils/theme/colors';
import { useI18n } from '../I18nProvider';
import { type Med } from '@/types';
import { type DashboardItemWithMedType } from '@/utils/sortAndFilterMeds';

interface INextIntakeProps {
    schedule: DashboardItemWithMedType;
}

export const NextIntake: FC<INextIntakeProps> = memo(({ schedule }) => {
    const { t } = useI18n();
    const { med, hours, minutes } = schedule;

    return (
        <Paper
            sx={{
                padding: 3,
                backgroundColor: PALETTE.BRAND_TEAL_LIGHT,
                border: `1px solid ${PALETTE.BRAND_WHITE}`,
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                color: PALETTE.BRAND_GREY,
            }}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Chip label={t('next-intake')} size="small" />
                <Typography variant="body2">{formatTime(hours, minutes)}</Typography>
            </Stack>
            <Stack gap={1}>
                <Typography
                    variant="h3"
                    sx={{ color: PALETTE.BRAND_BLACK, fontSize: 24, fontWeight: 600 }}
                >
                    {med.name}
                </Typography>
                <Typography variant="body2">{getNextDose(med)}</Typography>
            </Stack>
            <Chip
                sx={{ alignSelf: 'flex-start' }}
                icon={<RestaurantIcon />}
                label={t('With food')}
                size="small"
            />
            <Stack direction="row" gap={1} marginTop={2}>
                <Button variant="contained" fullWidth>
                    {t('Mark as taken')}
                </Button>
                <IconButton
                    size="small"
                    sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: PALETTE.BRAND_WHITE,
                        color: PALETTE.BRAND_BLACK,
                    }}
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </Stack>
        </Paper>
    );
});

const getNextDose = (med: Med) => {
    return `${med.strength} ${med.unit} ${DOT} ${formatMedDose(med)}`;
};
