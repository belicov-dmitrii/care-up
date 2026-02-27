'use client';

import { FC, memo } from 'react';
import { Paper, Stack, Chip, Typography, Button, IconButton } from '@mui/material';
import { type Med } from '@/types';
import { PALETTE } from '@/utils/theme/colors';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useI18n } from '../I18nProvider';

interface IProps {
    med: Med;
}

export const NextIntake: FC<IProps> = memo(({ med }) => {
    const { t } = useI18n();

    return (
        <Paper
            sx={{
                padding: 3,
                backgroundColor: PALETTE.PALE_CYAN_GRAY,
                border: `1px solid ${PALETTE.BRAND_WHITE}`,
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
            }}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Chip label={t('next-intake')} size="small" />
                <Typography variant="body2" sx={{ color: PALETTE.BRAND_GREY }}>
                    14:00
                </Typography>
            </Stack>
            <Stack gap={1}>
                <Typography variant="h4">{med.name}</Typography>
                <Typography variant="body2" sx={{ color: PALETTE.BRAND_GREY }}>
                    {getNextDose(med)}
                </Typography>
            </Stack>
            <Chip
                sx={{ alignSelf: 'flex-start' }}
                icon={<RestaurantIcon />}
                label={t('With food')}
                size="small"
            />
            <Stack direction="row" gap={1}>
                <Button variant="contained" fullWidth sx={{ padding: 0, maxHeight: '48px' }}>
                    {t('Mark as taken')}
                </Button>
                <IconButton
                    size="small"
                    sx={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '20px',
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
    return `${med.strength} ${med.unit} - ${med.dose} ${med.form.slice(0, -1)}`;
};
