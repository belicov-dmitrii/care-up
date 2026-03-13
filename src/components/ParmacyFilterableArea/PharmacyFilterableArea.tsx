'use client';

import { type Med, MedRemainingTime, MedStockStatus, type ScheduleItem } from '@/types';
import { ColumnBoxStyles } from '@/utils/consts';
import { PALETTE } from '@/utils/theme/colors';
import {
    Box,
    TextField,
    InputAdornment,
    Tabs,
    Tab,
    type CSSProperties,
    Typography,
} from '@mui/material';
import { PharmacyListItem } from '../PharmacyListItem/PharmacyListItem';
import SearchIcon from '@mui/icons-material/Search';
import { memo, useState, type FC, type ChangeEvent, useMemo } from 'react';
import { useI18n } from '../I18nProvider';
import {
    getMedRemainingTime,
    getMedStockStatus,
    isDateExpired,
    isDateExpiring,
} from '@/utils/getMedExtendedDetails';
import { enumToOptions } from '../Forms/utils/enumToOptions';

interface IPharmacyFilterableAreaProps {
    meds: Med[];
    schedules: ScheduleItem[];
}

enum FilterOptions {
    All = 'All Items',
    Attention = 'Needs Attention',
    Expired = 'Expired',
    LowStock = 'Low Stock',
    InStock = 'In Stock',
}
const FILTER_OPTIONS = enumToOptions(FilterOptions).map((option) => option.display);

const tabStyles: CSSProperties = {
    backgroundColor: PALETTE.BRAND_WHITE,
    color: PALETTE.BRAND_TEAL,
    fontSize: 14,
    fontWeight: 500,
    borderRadius: 999,
    padding: '8px 16px',
    minHeight: 38,
    '&.Mui-selected': {
        backgroundColor: PALETTE.BRAND_TEAL,
        color: PALETTE.BRAND_WHITE,
    },
    '&:not(:last-child)': { mr: 1 },
};

export const PharmacyFilterableArea: FC<IPharmacyFilterableAreaProps> = memo(
    ({ meds, schedules }) => {
        const { t } = useI18n();
        const [searchTerm, setSearchTerm] = useState<string>('');
        const [activeFilter, setActiveFilter] = useState<string>(FILTER_OPTIONS[0]);

        const handleFilterChange = (_: unknown, option: string) => {
            setActiveFilter(option);
        };

        const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value.trim());
        };

        const medsRemainingTime = useMemo(() => {
            return meds.reduce((acc: { [key: string]: string }, med) => {
                const medSchedule = schedules?.find((schedule) => schedule.medId === med.id);
                acc[med.id] = getMedRemainingTime(med, medSchedule);

                return acc;
            }, {});
        }, [meds, schedules]);

        const filteredMeds = useMemo(() => {
            return meds
                .filter((med) => {
                    return med.name.toLowerCase().includes(searchTerm.toLowerCase());
                })
                .filter((med) => {
                    const medStockStatus = getMedStockStatus(
                        med.remaining,
                        medsRemainingTime[med.id]
                    ).stockLabel;

                    const expired = isDateExpired(med?.expirationDate) || !med.remaining;

                    const needsAttention =
                        !expired &&
                        (medStockStatus === MedStockStatus.Expiring ||
                            isDateExpiring(med?.expirationDate) ||
                            (med.remaining &&
                                medsRemainingTime[med.id] === MedRemainingTime.Refill));

                    switch (activeFilter) {
                        case FilterOptions.Expired:
                            return expired;

                        case FilterOptions.Attention:
                            return needsAttention;

                        case FilterOptions.LowStock:
                            return (
                                !expired && !needsAttention && medStockStatus === MedStockStatus.Low
                            );

                        case FilterOptions.InStock:
                            return (
                                !expired &&
                                !needsAttention &&
                                medStockStatus === MedStockStatus.Good
                            );

                        default:
                            return true;
                    }
                });
        }, [meds, medsRemainingTime, searchTerm, activeFilter]);

        return (
            <>
                <Box>
                    <TextField
                        placeholder={t('Search medications...')}
                        value={searchTerm}
                        autoComplete="false"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                                sx: {
                                    height: 48,
                                    backgroundColor: PALETTE.BRAND_WHITE,
                                    border: 'none',
                                    borderRadius: '12px',
                                },
                            },
                        }}
                        onChange={handleSearchChange}
                    />
                </Box>
                <Box>
                    <Tabs
                        variant="scrollable"
                        value={activeFilter}
                        slotProps={{ indicator: { style: { display: 'none' } } }}
                        onChange={handleFilterChange}
                    >
                        {FILTER_OPTIONS.map((option) => {
                            return (
                                <Tab key={option} value={option} label={option} sx={tabStyles} />
                            );
                        })}
                    </Tabs>
                </Box>
                <Box sx={{ ...ColumnBoxStyles }}>
                    {filteredMeds.length ? (
                        filteredMeds.map((med) => {
                            const medStock = getMedStockStatus(
                                med.remaining,
                                medsRemainingTime[med.id]
                            );
                            return (
                                <PharmacyListItem
                                    key={med.id}
                                    med={med}
                                    medRemainingTime={medsRemainingTime[med.id]}
                                    medStock={medStock}
                                />
                            );
                        })
                    ) : (
                        <Typography
                            variant="h5"
                            sx={{
                                color: PALETTE.BRAND_GREY,
                                opacity: '0.6',
                                fontSize: 18,
                                textAlign: 'center',
                                padding: '40px 0',
                            }}
                        >
                            {t('No matches.')}
                        </Typography>
                    )}
                </Box>
            </>
        );
    }
);
