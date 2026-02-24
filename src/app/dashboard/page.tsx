import { getServerT } from '@/i18n';
import { Box, Paper } from '@mui/material';
import '@/styles/dashboard.module.scss';

export default async function MainPage() {
    const t = await getServerT();

    return (
        <Box>
            <Paper>
                {t('test')}
                <Box>Dashboard</Box>
            </Paper>
        </Box>
    );
}
