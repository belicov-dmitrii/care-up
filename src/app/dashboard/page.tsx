import '@/styles/dashboard.module.scss';
import { getServerT } from '@/i18n';
import { Alert, Avatar, Box, Button, Container, Stack, Typography } from '@mui/material';
import { getMeds } from '@/utils/dashboard/getMeds';
import { getSchedule } from '@/utils/dashboard/getSchedule';
import SpaIcon from '@mui/icons-material/Spa';
import InventoryIcon from '@mui/icons-material/Inventory';
import { PALETTE } from '@/utils/theme/colors';
import { NextIntake } from '@/components/NextIntake/NextIntake';
import { MedList } from '@/components/MedList/MedList';
import { type Med, type ScheduleItem, ScheduleType } from '@/types';

const getTodaysMeds = (meds: Array<Med>, schedules: Array<ScheduleItem>) => {
    return meds?.filter((med) => {
        const medSchedule = schedules?.find((schedule) => schedule?.medId === med?.id);

        if (!medSchedule) return false;

        // const today = moment();

        return medSchedule?.type === ScheduleType.EveryDay || medSchedule?.startDate;
    });
};

export default async function Dashboards() {
    const t = await getServerT();
    const meds = await getMeds();
    const schedule = await getSchedule();
    const hasAlerts = true;

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Stack gap={1}>
                    <Typography variant="h3">
                        {t('good-afternoon')} <SpaIcon />
                    </Typography>
                    <Typography variant="body1" color={PALETTE.BRAND_GREY}>
                        {t('today-things')}
                    </Typography>
                </Stack>
                <Avatar src="/care-logo.png" sx={{ width: 56, height: 56 }} />
            </Box>
            <NextIntake med={meds[0]} />
            {hasAlerts && (
                <Alert
                    sx={{
                        backgroundColor: PALETTE.WARM_WHITE,
                        color: PALETTE.BROWN,
                        alignItems: 'center',
                        height: '77px',
                    }}
                    icon={
                        <InventoryIcon
                            sx={{
                                color: PALETTE.GOLDEN_BROWN,
                            }}
                        />
                    }
                    action={
                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                backgroundColor: PALETTE.BRAND_WHITE,
                                color: 'primary.main',
                                padding: 0,
                                minHeight: '36px',
                            }}
                        >
                            Refill
                        </Button>
                    }
                >
                    Vitamin D is running low.
                </Alert>
            )}
            <MedList meds={meds} />
        </Container>
    );
}
