'use client';

import { type FC, memo } from 'react';
import { Paper, Stack, Chip, Typography, Button, IconButton } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { formatTime } from '@/utils/formatData';
import { DATE_FORMAT, DOT } from '@/utils/consts';
import { PALETTE } from '@/utils/theme/colors';
import { useI18n } from '../I18nProvider';
import { type IntakeEvent, type Med } from '@/types';
import { type DashboardItemWithMedType } from '@/utils/sortAndFilterMeds';
import { getMedFormToDoseUnit } from '@/utils/getMedFormToDoseUnit';
import { useRouter } from 'next/navigation';
import { NetworkRequest } from '@/utils/NetworkRequest';
import moment from 'moment';
import { encodeIdWithDate } from '@/utils/eventsEncoder';
import Link from 'next/link';

interface INextIntakeProps {
    schedule: DashboardItemWithMedType;
}

export const NextIntake: FC<INextIntakeProps> = memo(({ schedule }) => {
    const { t } = useI18n();
    const { med, hours, minutes } = schedule;
    const router = useRouter();

    const dose = schedule.dose[schedule['timeId']] || 0;

    const id = encodeIdWithDate(schedule.scheduleByTimeId, moment().format(DATE_FORMAT));

    const submitEvent = async () => {
        const newEvent: Omit<IntakeEvent, 'userId'> = {
            id,
            status: 'taken',
            medId: schedule.medId,
            medName: med.name,
            time: formatTime(schedule.hours, schedule.minutes),
            medStrenght: `${med.strength} ${med.unit}`,
            scheduleId: schedule.id,
            scheduleTimeId: schedule.timeId,
            eventDate: moment().format(DATE_FORMAT),
            symptoms: [],
            createdAt: new Date().toISOString(),
            updatedAt: null,
        };

        const { ok } = await NetworkRequest('/intake-event', { ...newEvent }, { method: 'POST' });

        if (!ok) {
            return;
        }

        router.refresh();
    };

    return (
        <Paper
            sx={{
                padding: 3,
                backgroundColor: PALETTE.BRAND_TEAL_LIGHT,
                border: `1px solid ${PALETTE.BRAND_WHITE}`,
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                color: PALETTE.BRAND_GREY,
            }}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Chip label={t('next-intake')} size="small" />
                <Typography variant="body2">{formatTime(hours, minutes)}</Typography>
            </Stack>
            <Stack gap={1}>
                <Typography
                    variant="h3"
                    sx={{ color: PALETTE.BRAND_BLACK, fontSize: 24, fontWeight: 600 }}
                >
                    {med.name}
                </Typography>
                <Typography variant="body2">{getNextDose(med, dose)}</Typography>
            </Stack>
            <Chip
                sx={{ alignSelf: 'flex-start' }}
                icon={<RestaurantIcon />}
                label={t('With food')}
                size="small"
            />
            <Stack direction="row" gap={1} marginTop={2}>
                <Button variant="contained" fullWidth onClick={submitEvent}>
                    {t('Mark as taken')}
                </Button>
                <Link
                    href={`/dashboard/${encodeIdWithDate(schedule.scheduleByTimeId, moment().format(DATE_FORMAT))}`}
                >
                    <IconButton
                        size="small"
                        sx={{
                            width: 48,
                            height: 48,
                            backgroundColor: PALETTE.BRAND_WHITE,
                            color: PALETTE.BRAND_BLACK,
                        }}
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Link>
            </Stack>
        </Paper>
    );
});

const getNextDose = (med: Med, dose: number) => {
    return `${med.strength} ${med.unit} ${DOT} ${dose} ${getMedFormToDoseUnit(med.form, dose)}`;
};
