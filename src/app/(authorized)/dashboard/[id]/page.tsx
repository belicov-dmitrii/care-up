import { formatMedDose, formatTime } from '@/utils/formatData';
import { getMeds } from '@/utils/requests/getMeds';
import { getSchedule } from '@/utils/requests/getSchedule';
import { getMedScheduleByScheduleId } from '@/utils/sortAndFilterMeds';
import { Box, Chip, Container, Stack, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getServerT } from '@/i18n';
import { PALETTE } from '@/utils/theme/colors';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { ColumnBoxStyles } from '@/utils/consts';
import { decodeIdWithDate } from '@/utils/eventsEncoder';
import { getIntakeEvent } from '@/utils/requests/getIntakeEvent';
import { EventActions } from '@/components/EventActions/EventActions';
import { RecommendationCategory } from '@/types';
import Link from 'next/link';

interface IMedScheduleDetailsProps {
    params: {
        id: string;
    };
}

export default async function MedScheduleDetails({ params }: IMedScheduleDetailsProps) {
    const { id: paramsId } = await params;

    const t = await getServerT();
    const meds = await getMeds();
    const schedules = await getSchedule();
    const event = await getIntakeEvent(paramsId);

    const { id, date } = decodeIdWithDate(paramsId);
    const medSchedule = getMedScheduleByScheduleId(id, meds, schedules);

    if (!medSchedule)
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
                {t('No data.')}
            </Typography>
        );

    const { med, hours, minutes, recommendations } = medSchedule;

    return (
        <Container sx={{ ...ColumnBoxStyles, textAlign: 'center', gap: 6, p: 3 }}>
            <Box>
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
                {recommendations?.map((recommendation) => {
                    return <InfoBox key={recommendation.id} {...recommendation} />;
                })}
                <Box mt={4}>
                    <Link href={`/pharmacy/${med.id}`}>
                        <InfoBox
                            title="Home Pharmacy"
                            note={`${med.remaining} ${med.form.toLocaleLowerCase()} left`}
                            category={RecommendationCategory.StorageInstructions}
                            showArrow
                        />
                    </Link>
                </Box>
            </Box>

            <EventActions id={paramsId} medSchedule={medSchedule} date={date} event={event} />
        </Container>
    );
}
