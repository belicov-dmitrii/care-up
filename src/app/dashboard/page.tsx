import { getServerT } from '@/i18n';
import { Box, Paper } from '@mui/material';
import { getMeds } from '@/utils/dashboard/getMeds';
import { getSchedule } from '@/utils/dashboard/getSchedule';
import '@/styles/dashboard.module.scss';

export default async function Dashboards() {
    const t = await getServerT();
    const meds = await getMeds();
    const schedule = await getSchedule();

    return (
        <Box>
            <Paper>
                {t('test')}
                <Box>Dashboard</Box>
            </Paper>
        </Box>
    );
}
