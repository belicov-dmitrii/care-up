'use client';

import { Box, Button, Typography } from '@mui/material';
import { type FC, memo, useEffect, useState } from 'react';
import { useI18n } from '../I18nProvider';
import { PALETTE } from '@/utils/theme/colors';
import { type IntakeEvent } from '@/types';
import { type DashboardItemWithMedType } from '@/utils/sortAndFilterMeds';
import { formatTime } from '@/utils/formatData';
import { NetworkRequest } from '@/utils/NetworkRequest';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoDisturbAltRoundedIcon from '@mui/icons-material/DoDisturbAltRounded';
import { SymptomsChooser } from '../SymptomsChooser/SymptomsChooser';

interface IEventActionsProps {
    id: string;
    medSchedule: DashboardItemWithMedType;
    event: IntakeEvent | null;
    date: string;
}

export const EventActions: FC<IEventActionsProps> = memo(({ id, medSchedule, event, date }) => {
    const [eventType, setEventType] = useState<null | 'taken' | 'skipped' | 'missed'>(null);

    const { t } = useI18n();
    const { med } = medSchedule;

    useEffect(() => {
        if (event?.status && event?.status !== eventType) {
            setEventType(event?.status);
        }
    }, [event?.status, eventType]);

    const submitEvent = (action: 'skip' | 'take') => {
        return async () => {
            const status = action === 'skip' ? 'skipped' : 'taken';

            const newEvent: Omit<IntakeEvent, 'userId'> = {
                id,
                status,
                medId: medSchedule.medId,
                medName: med.name,
                time: formatTime(medSchedule.hours, medSchedule.minutes),
                medStrenght: `${med.strength} ${med.unit}`,
                scheduleId: medSchedule.id,
                scheduleTimeId: medSchedule.timeId,
                eventDate: date,
                symptoms: [],
                createdAt: new Date().toISOString(),
                updatedAt: null,
            };

            const { ok } = await NetworkRequest(
                '/intake-event',
                { ...newEvent },
                { method: 'POST' }
            );

            if (!ok) {
                return;
            }

            setEventType(status);
        };
    };

    if (eventType) {
        const isTaken = eventType === 'taken';

        return (
            <Box sx={{ diplay: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                    p={2}
                    sx={{
                        background: isTaken ? PALETTE.BUTTON_BG_TEAL : PALETTE.BUTTON_BG_LAVANDER,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderRadius: '22px',
                    }}
                >
                    <Box
                        sx={{
                            color: isTaken ? PALETTE.TEXT_SUCCESS : PALETTE.ICON_PURPLE,
                            '& svg': {
                                fontSize: '60px',
                            },
                        }}
                    >
                        {isTaken ? (
                            <CheckCircleIcon color="inherit" />
                        ) : (
                            <DoDisturbAltRoundedIcon color="inherit" />
                        )}
                    </Box>
                    <Box textAlign="left">
                        <Typography
                            sx={{
                                textTransform: 'capitalize',
                                color: isTaken ? PALETTE.TEXT_SUCCESS : PALETTE.ICON_PURPLE,
                            }}
                        >
                            {eventType}
                        </Typography>
                        <Typography>
                            {t("You've marked this medication as {status}.", { status: eventType })}
                        </Typography>
                    </Box>
                </Box>
                <Box mt={2}>
                    <SymptomsChooser eventId={event?.id} initialValues={event?.symptoms} />
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 2 }}>
            <Button variant="contained" size="large" onClick={submitEvent('take')}>
                {t('Mark as taken')}
            </Button>
            <Button
                variant="contained"
                sx={{ backgroundColor: PALETTE.BRAND_TEAL_LIGHT, color: PALETTE.BRAND_TEAL }}
                size="large"
                onClick={submitEvent('skip')}
            >
                {t('Skip')}
            </Button>
        </Box>
    );
});
