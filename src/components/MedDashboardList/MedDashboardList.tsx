'use client';

import { type FC, memo } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { type IntakeEvent, type Med } from '@/types';
import { DOT } from '@/utils/consts';
import { PALETTE } from '@/utils/theme/colors';
import { useI18n } from '../I18nProvider';
import { type DashboardItemWithMedType } from '@/utils/sortAndFilterMeds';
import { formatTime } from '@/utils/formatData';
import moment from 'moment';
import { encodeIdWithDate } from '@/utils/eventsEncoder';
import { EventStatus } from '../EventStatus/EventStatus';
import { capitalize } from '@/utils/capitalize';

interface IProps {
    schedules: DashboardItemWithMedType[];
}

export const MedDashboardList: FC<IProps> = memo(({ schedules }) => {
    const { t } = useI18n();

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
        <Box>
            <Typography variant="h3">{t('Today')}</Typography>
            <List>
                {schedules.map(({ scheduleByTimeId, med, hours, minutes, event }) => {
                    const isMarkedAsTaken = event?.status === 'taken';

                    return (
                        <ListItem
                            key={scheduleByTimeId}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                opacity: isMarkedAsTaken ? '0.5' : '',
                                color: PALETTE.BRAND_GREY,
                                height: 70,
                            }}
                        >
                            <Typography variant="body2">{formatTime(hours, minutes)}</Typography>
                            <EventStatus status={event?.status} />
                            <ListItemButton
                                href={`/dashboard/${encodeIdWithDate(scheduleByTimeId, moment().format('DD-MM-YYYY'))}`}
                            >
                                <ListItemText
                                    primary={med.name}
                                    secondary={getSecondaryListItemText(med, event?.status)}
                                    slotProps={{
                                        primary: { fontWeight: 600, color: PALETTE.BRAND_BLACK },
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
});

const getSecondaryListItemText = (med: Med, eventStatus?: IntakeEvent['status']) => {
    return `${med.strength} ${med.unit} ${eventStatus ? ` ${DOT} ${capitalize(eventStatus)}` : ''}`;
};
