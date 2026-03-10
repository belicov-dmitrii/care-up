import { AddMedicationButton } from '@/components/AddMedication/AddMedicationButton';
import { ScheduleTabs } from '@/components/ScheduleTabs/ScheduleTabs';
import { getMeds } from '@/utils/requests/getMeds';
import { getSchedule } from '@/utils/requests/getSchedule';
import { getTodayEvents } from '@/utils/requests/getTodayEvents';
import { Container, Typography } from '@mui/material';
import moment from 'moment';

export default async function Schedule() {
    const schedule = await getSchedule();
    const meds = await getMeds();
    const todayEvents = await getTodayEvents(
        moment().format('DD-MM-YYYY'),
        moment().format('DD-MM-YYYY')
    );

    return (
        <Container
            sx={{
                bgcolor: 'background.default',
                padding: '32px 24px 24px',
                gap: 3,
            }}
        >
            <AddMedicationButton />
            <Typography variant="h1" fontWeight={600}>
                Schedule
            </Typography>
            <ScheduleTabs schedule={schedule} meds={meds} events={todayEvents} />
        </Container>
    );
}
