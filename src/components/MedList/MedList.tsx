'use client';

import { type Med } from '@/types';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { FC, memo, useState } from 'react';
import { Checkbox } from '../Checkbox/Checkbox';
import { DOT } from '@/utils/consts';
import { PALETTE } from '@/utils/theme/colors';
import { useI18n } from '../I18nProvider';

interface Props {
    meds: Med[] | undefined;
}

export const MedList: FC<Props> = memo(({ meds }) => {
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

    if (!meds?.length) {
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
            {meds.map((med) => (
                <ListItem
                    key={med.id}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Typography variant="body2">14:00</Typography>
                    <Checkbox
                        id={med?.id}
                        checked={checkedIds.includes(med?.id)}
                        onChange={handleUpdateMedCheckbox}
                    />
                    <ListItemText
                        primary={med.name}
                        secondary={getSecondaryListItemText(med, checkedIds)}
                    />
                </ListItem>
            ))}
        </List>
    );
});

const getSecondaryListItemText = (med: Med, checkedIds: string[]) => {
    return `${med.strength} ${med.unit} ${checkedIds.includes(med.id) ? ` ${DOT} Taken` : ''}`;
};
