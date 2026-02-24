import { getServerT } from '@/i18n';
import { Box, Paper } from '@mui/material';
import '@/styles/dashboard.module.scss';
import { getMeds } from '@/utils/dashboard/getMeds';

export default async function Dashboards() {
    const t = await getServerT();
    const meds = await getMeds();

    console.log('🚀 ~ Dashboards ~ meds:', meds);

    return (
        <Box>
            <Paper>
                {t('test')}
                <Box>Dashboard</Box>
            </Paper>
        </Box>
    );
}
