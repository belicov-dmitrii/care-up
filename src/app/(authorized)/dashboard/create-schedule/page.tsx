import { CreateScheduleForm } from '@/components/CreateScheduleForm/CreateScheduleForm';
import { getServerT } from '@/i18n';
import { ColumnBoxStyles } from '@/utils/consts';
import { getMeds } from '@/utils/requests/getMeds';
import { Container, Stack, Typography } from '@mui/material';

interface ICreateScheduleProps {
    searchParams: {
        id?: string;
    };
}

export default async function CreateSchedule({ searchParams }: ICreateScheduleProps) {
    const t = await getServerT();
    const { id } = await searchParams;
    const meds = await getMeds();

    if (!meds?.length)
        return (
            <Typography
                variant="h5"
                sx={{
                    color: 'text.secondary',
                    opacity: '0.6',
                    fontSize: 18,
                    textAlign: 'center',
                    padding: '40px 0',
                }}
            >
                {t('No meds.')}
            </Typography>
        );

    return (
        <Container sx={{ ...ColumnBoxStyles, p: 3 }}>
            <Stack gap={1}>
                <Typography variant="h1">{t('Create Schedule')}</Typography>
                <Typography variant="body1" sx={{ fontSize: 14, color: 'text.secondary' }}>
                    {t('Set when this medication should be taken.')}
                </Typography>
            </Stack>
            <CreateScheduleForm id={id} meds={meds} />
        </Container>
    );
}
