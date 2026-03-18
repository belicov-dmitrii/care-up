'use client';
import { type Med } from '@/types';
import { ColumnBoxStyles, RowBoxStyles } from '@/utils/consts';
import { Box, alpha, Paper, Typography, Chip, Button } from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useI18n } from '../I18nProvider';
import { memo, type FC } from 'react';
import { getMedUnitDetails, isDateExpiring, isDateExpired } from '@/utils/getMedExtendedDetails';
import { formatMedExpirationDate } from '@/utils/formatData';
import { PALETTE } from '@/utils/theme/colors';

interface IPharmacyListItemProps {
    med: Med;
    medRemainingTime: string;
    medStock: { stockLabel: string; stockColor: string };
}

export const PharmacyListItem: FC<IPharmacyListItemProps> = memo(
    ({ med, medRemainingTime, medStock }) => {
        const { t } = useI18n();
        const { stockLabel, stockColor } = medStock;
        const stockBackgroundColor = alpha(stockColor, 0.1);
        const medExpirationColor =
            isDateExpiring(med.expirationDate) || isDateExpired(med.expirationDate)
                ? PALETTE.ERROR
                : PALETTE.SUCCESS;

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
                            <Typography
                                variant="h3"
                                sx={{ fontSize: 18, fontWeight: 600, mb: 0.5 }}
                            >
                                {med.name}
                            </Typography>
                            <Typography sx={{ color: 'text.secondary' }} variant="body2">
                                {getMedUnitDetails(med, false)}
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
                            {medRemainingTime}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            ...RowBoxStyles,
                            backgroundColor: alpha(medExpirationColor, 0.1),
                            color: medExpirationColor,
                            borderRadius: '12px',
                            padding: '10px 12px',
                        }}
                    >
                        <CalendarMonthIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2">
                            {t(getMedExpirationLabel(med.expirationDate))}
                        </Typography>
                    </Box>
                </Paper>
            </Button>
        );
    }
);

const getMedExpirationLabel = (expirationDate: string | undefined) => {
    if (!expirationDate) return 'No Expiration Date';
    return `${isDateExpired(expirationDate) ? 'Expired' : 'Expires'} ${formatMedExpirationDate(expirationDate)}`;
};
