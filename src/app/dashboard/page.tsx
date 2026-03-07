import '@/styles/dashboard.module.scss';
import { getServerT } from '@/i18n';
import { Alert, Button, Container } from '@mui/material';
import { getMeds } from '@/utils/requests/getMeds';
import { getSchedule } from '@/utils/requests/getSchedule';
import InventoryIcon from '@mui/icons-material/Inventory';
import { PALETTE } from '@/utils/theme/colors';
import { NextIntake } from '@/components/NextIntake/NextIntake';
import { MedDashboardList } from '@/components/MedDashboardList/MedDashboardList';
import { getTodaySchedule } from '@/utils/sortAndFilterMeds';
import { DashboardHeader } from '@/components/DashboardHeader/DashboardHeader';

const hasAlerts = true;

export default async function Dashboards() {
    const t = await getServerT();
    const meds = await getMeds();
    const schedules = await getSchedule();
    const todaySchedules = getTodaySchedule(meds, schedules);

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: 3 }}>
            <DashboardHeader schedulesCount={todaySchedules.length} />
            <NextIntake schedule={todaySchedules[0]} />
            {hasAlerts && (
                <Alert
                    sx={{
                        backgroundColor: PALETTE.WARM_WHITE,
                        color: PALETTE.BROWN,
                        alignItems: 'center',
                        height: 77,
                    }}
                    icon={
                        <InventoryIcon
                            sx={{
                                color: PALETTE.WARNING,
                            }}
                        />
                    }
                    action={
                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                backgroundColor: PALETTE.BRAND_WHITE,
                                color: PALETTE.BRAND_BLACK,
                            }}
                        >
                            {t('Refill')}
                        </Button>
                    }
                >
                    Vitamin D is running low.
                </Alert>
            )}
            <MedDashboardList schedules={todaySchedules} />
        </Container>
    );
}
