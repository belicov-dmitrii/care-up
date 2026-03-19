import { getServerT } from '@/i18n';
import { Container, Typography } from '@mui/material';
import { getMeds } from '@/utils/requests/getMeds';
import { ColumnBoxStyles } from '@/utils/consts';
import { PharmacyFilterableArea } from '@/components/ParmacyFilterableArea/PharmacyFilterableArea';
import { getSchedule } from '@/utils/requests/getSchedule';
import PharmacyMenu from '@/components/PharmacyMenu/PharmacyMenu';
import { Maps } from '@/components/Maps/Maps';

export default async function Pharmacy() {
    const t = await getServerT();
    const meds = await getMeds();
    const schedules = await getSchedule();

    return (
        <Container sx={{ ...ColumnBoxStyles, padding: 3, pt: 4 }}>
            <Typography variant="h1" fontWeight={600} mb={2}>
                {t('Pharmacy')}
            </Typography>
            <Maps />
            <PharmacyMenu />
            <PharmacyFilterableArea meds={meds} schedules={schedules} />
        </Container>
    );
}
