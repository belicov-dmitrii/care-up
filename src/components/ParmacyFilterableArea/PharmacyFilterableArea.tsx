'use client';

import { type Med, MedStockStatus } from '@/types';
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
import { getMedStockStatus } from '@/utils/getMedExtendedDetails';

interface IPharmacyFilterableAreaProps {
    meds: Med[];
}

const FILTER_OPTIONS = [
    'All items',
    MedStockStatus.Empty,
    MedStockStatus.Expiring,
    MedStockStatus.Low,
    MedStockStatus.Good,
];

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

export const PharmacyFilterableArea: FC<IPharmacyFilterableAreaProps> = memo(({ meds }) => {
    const { t } = useI18n();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState<string>(FILTER_OPTIONS[0]);

    const handleFilterChange = (_: unknown, option: string) => {
        setActiveFilter(option);
    };

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.trim());
    };

    const filteredMeds = useMemo(() => {
        return meds
            .filter((med) => {
                return med.name.toLowerCase().includes(searchTerm.toLowerCase());
            })
            .filter((med) => {
                if (activeFilter === FILTER_OPTIONS[0]) return true;

                const medStockStatus = getMedStockStatus(med.remaining).stockLabel;
                return medStockStatus === activeFilter;
            });
    }, [meds, searchTerm, activeFilter]);

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
                        return <Tab key={option} value={option} label={option} sx={tabStyles} />;
                    })}
                </Tabs>
            </Box>
            <Box sx={{ ...ColumnBoxStyles }}>
                {filteredMeds.length ? (
                    filteredMeds.map((med) => {
                        return <PharmacyListItem key={med.id} med={med} />;
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
});
