'use client';

import { Med } from '@/types';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { FC, memo, useState } from 'react';
import { Checkbox } from '../Checkbox/Checkbox';

interface Props {
    meds: Array<Med>;
}

export const MedList: FC<Props> = memo(({ meds }) => {
    const [checkedIds, setCheckedIds] = useState<Array<string>>([]);

    const handleUpdateMedCheckbox = (medId: string, checked: boolean) => {
        setCheckedIds((prev) => {
            if (!checked) {
                return [...prev].filter((id) => id !== medId);
            }

            return [...prev, medId];
        });
    };

    return (
        <Box>
            <Typography variant="h4">Today</Typography>
            <List>
                {meds?.length &&
                    meds.map((med) => (
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
        </Box>
    );
});

const getSecondaryListItemText = (med: Med, checkedIds: string[]) => {
    if (!med) return;
    return `${med.strength} ${med.unit} ${checkedIds.includes(med.id) ? ' - Taken' : ''}`;
};
