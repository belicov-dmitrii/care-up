'use client';

import { type FC, memo, useState } from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { type Med } from '@/types';
import { Checkbox } from '../Checkbox/Checkbox';
import { DOT } from '@/utils/consts';
import { PALETTE } from '@/utils/theme/colors';
import { useI18n } from '../I18nProvider';
import { DashboardItemWithMedType } from '@/utils/sortAndFilterMeds';
import { formatTime } from '@/utils/addTrailingZero';

interface IProps {
    schedules: DashboardItemWithMedType[];
}

export const MedList: FC<IProps> = memo(({ schedules }) => {
    const { t } = useI18n();
    const [checkedIds, setCheckedIds] = useState<Array<string>>([]);

    const handleUpdateMedCheckbox = (medId: string, checked: boolean) => {
        setCheckedIds((prev) => {
            if (!checked) {
                return [...prev].filter((id) => id !== medId);
            }

            return [...prev, medId];
        });
    };

    if (!schedules?.length) {
        return (
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
                {t('nothing-today')}
            </Typography>
        );
    }

    return (
        <List>
            {schedules.map(({ id, med, hours, minutes }) => {
                const isMarkedAsTaken = checkedIds.includes(id);

                return (
                    <ListItem
                        key={id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            opacity: isMarkedAsTaken ? '0.5' : '',
                            color: PALETTE.BRAND_GREY,
                        }}
                    >
                        <Typography variant="body2">{formatTime(hours, minutes)}</Typography>
                        <Checkbox
                            id={id}
                            checked={isMarkedAsTaken}
                            onChange={handleUpdateMedCheckbox}
                        />
                        <ListItemText
                            primary={med.name}
                            secondary={getSecondaryListItemText(med, isMarkedAsTaken)}
                            slotProps={{
                                primary: { fontWeight: 600, color: PALETTE.BRAND_BLACK },
                            }}
                        />
                    </ListItem>
                );
            })}
        </List>
    );
});

const getSecondaryListItemText = (med: Med, isMarkedAsTaken: boolean) => {
    return `${med.strength} ${med.unit} ${isMarkedAsTaken ? ` ${DOT} Taken` : ''}`;
};
