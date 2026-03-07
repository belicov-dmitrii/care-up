'use client';
import { type Med } from '@/types';
import { ColumnBoxStyles, RowBoxStyles } from '@/utils/consts';
import { Box, alpha, Paper, Typography, Chip, Button } from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useI18n } from '../I18nProvider';
import { memo, type FC } from 'react';
import {
    getMedUnitDetails,
    getMedRemainingTime,
    getMedStockStatus,
} from '@/utils/getMedExtendedDetails';
import { formatMedExpirationDate } from '@/utils/formatData';

interface IPharmacyListItemProps {
    med: Med;
}

export const PharmacyListItem: FC<IPharmacyListItemProps> = memo(({ med }) => {
    const { t } = useI18n();
    const { stockLabel, stockColor } = getMedStockStatus(med.remaining);
    const stockBackgroundColor = alpha(stockColor, 0.1);

    return (
        <Button href={`/pharmacy/${med.id}`} sx={{ padding: 0 }}>
            <Paper
                sx={{
                    ...ColumnBoxStyles,
                    gap: 2,
                    padding: 3,
                    borderRadius: '14px',
                    fontSize: 14,
                    fontWeight: 400,
                    width: '100%',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h3" sx={{ fontSize: 18, fontWeight: 600, mb: 0.5 }}>
                            {med.name}
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }} variant="body2">
                            {getMedUnitDetails(med)}
                        </Typography>
                    </Box>
                    <Chip
                        size="small"
                        label={stockLabel}
                        sx={{ color: stockColor, backgroundColor: stockBackgroundColor }}
                    />
                </Box>
                <Box sx={{ ...RowBoxStyles, justifyContent: 'space-between' }}>
                    <Box sx={{ ...RowBoxStyles }}>
                        <Box
                            className="icon-container"
                            sx={{
                                fontSize: 16,
                                height: 32,
                                width: 32,
                                borderRadius: '8px',
                                color: stockColor,
                                backgroundColor: stockBackgroundColor,
                            }}
                        >
                            <LayersIcon />
                        </Box>
                        <Typography
                            variant="body1"
                            sx={{ color: stockColor }}
                        >{`${med.remaining} ${t('remaining')}`}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        ~{getMedRemainingTime(med.expirationDate)}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        ...RowBoxStyles,
                        backgroundColor: stockBackgroundColor,
                        color: stockColor,
                        borderRadius: '12px',
                        padding: '10px 12px',
                    }}
                >
                    <CalendarMonthIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2">
                        {`${t('Expires')} ${formatMedExpirationDate(med.expirationDate)}`}
                    </Typography>
                </Box>
            </Paper>
        </Button>
    );
});
