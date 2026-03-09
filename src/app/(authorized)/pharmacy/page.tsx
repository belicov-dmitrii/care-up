import { getServerT } from '@/i18n';
import { Container, Typography } from '@mui/material';
import { getMeds } from '@/utils/requests/getMeds';
import { ColumnBoxStyles } from '@/utils/consts';
import { PharmacyFilterableArea } from '@/components/ParmacyFilterableArea/PharmacyFilterableArea';
import { getSchedule } from '@/utils/requests/getSchedule';

export default async function Pharmacy() {
    const t = await getServerT();
    const meds = await getMeds();
    const schedules = await getSchedule();

    if (!meds?.length) return <div>No meds</div>;

    return (
        <Container sx={{ ...ColumnBoxStyles, padding: 3 }}>
            <Typography variant="h1" fontWeight={600}>
                {t('Pharmacy')}
            </Typography>
            <PharmacyFilterableArea meds={meds} schedules={schedules} />
        </Container>
    );
}
