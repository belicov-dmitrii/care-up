'use client';

import { type FC, memo, useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { type Med } from '@/types';
import { Checkbox } from '../Checkbox/Checkbox';
import { DOT } from '@/utils/consts';
import { PALETTE } from '@/utils/theme/colors';
import { useI18n } from '../I18nProvider';
import { type DashboardItemWithMedType } from '@/utils/sortAndFilterMeds';
import { formatTime } from '@/utils/formatData';

interface IProps {
    schedules: DashboardItemWithMedType[];
}

export const MedDashboardList: FC<IProps> = memo(({ schedules }) => {
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
            {schedules.map(({ scheduleByTimeId, med, hours, minutes }) => {
                const isMarkedAsTaken = checkedIds.includes(scheduleByTimeId);

                return (
                    <ListItem
                        key={scheduleByTimeId}
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
                            id={scheduleByTimeId}
                            checked={isMarkedAsTaken}
                            onChange={handleUpdateMedCheckbox}
                        />
                        <ListItemButton href={`/dashboard/${scheduleByTimeId}`}>
                            <ListItemText
                                primary={med.name}
                                secondary={getSecondaryListItemText(med, isMarkedAsTaken)}
                                slotProps={{
                                    primary: { fontWeight: 600, color: PALETTE.BRAND_BLACK },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
});

const getSecondaryListItemText = (med: Med, isMarkedAsTaken: boolean) => {
    return `${med.strength} ${med.unit} ${isMarkedAsTaken ? ` ${DOT} Taken` : ''}`;
};
