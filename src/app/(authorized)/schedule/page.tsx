import { ScheduleTabs } from '@/components/ScheduleTabs/ScheduleTabs';
import { getMeds } from '@/utils/requests/getMeds';
import { getSchedule } from '@/utils/requests/getSchedule';
import { Container, Typography } from '@mui/material';

export default async function Schedule() {
    const schedule = await getSchedule();
    const meds = await getMeds();

    return (
        <Container
            sx={{
                bgcolor: 'background.default',
                padding: '32px 24px 24px',
                gap: 3,
            }}
        >
            <Typography variant="h1" fontWeight={600}>
                Schedule
            </Typography>
            <ScheduleTabs schedule={schedule} meds={meds} />
        </Container>
    );
}
