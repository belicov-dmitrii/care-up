import { formatMedDose, formatTime } from '@/utils/formatData';
import { getMeds } from '@/utils/dashboard/getMeds';
import { getSchedule } from '@/utils/dashboard/getSchedule';
import { getTodaySchedule } from '@/utils/sortAndFilterMeds';
import { Box, Button, Chip, Container, Stack, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getServerT } from '@/i18n';
import { PALETTE } from '@/utils/theme/colors';
import { InfoBox } from '@/components/InfoBox/InfoBox';

interface IMedScheduleDetailsProps {
    params: {
        id: string;
    };
}

export default async function MedScheduleDetails({ params }: IMedScheduleDetailsProps) {
    const { id } = await params;
    const t = await getServerT();
    const meds = await getMeds();
    const schedules = await getSchedule();
    const { med, hours, minutes } = getTodaySchedule(meds, schedules)[0];

    return (
        <Container sx={{ textAlign: 'center' }}>
            <Box mb={4}>
                <Typography variant="h1" mb={2}>
                    {med.name}
                </Typography>
                <Chip
                    size="medium"
                    icon={<AccessTimeIcon />}
                    label={formatTime(hours, minutes)}
                    sx={{ alignSelf: 'center' }}
                />
                <Stack
                    sx={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 0.3,
                        mt: 2,
                        color: PALETTE.BRAND_TEAL,
                    }}
                >
                    <Typography variant="body1" sx={{ fontSize: 40, fontWeight: 600 }}>
                        {med.strength}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: 20, fontWeight: 600, mt: 2.8 }}>
                        {med.unit}
                    </Typography>
                </Stack>
                <Typography variant="body1" fontWeight={500}>
                    {formatMedDose(med)}
                </Typography>
            </Box>
            <Box>
                <InfoBox />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 2 }}>
                <Button variant="contained" size="large">
                    {t('Mark as taken')}
                </Button>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: PALETTE.BRAND_TEAL_LIGHT, color: PALETTE.BRAND_TEAL }}
                    size="large"
                >
                    {t('Snooze for 1 hour')}
                </Button>
                <Button variant="text" sx={{ color: PALETTE.TEXT_PRIMARY }} size="large">
                    {t('Reschedule intake')}
                </Button>
            </Box>
        </Container>
    );
}
