import { PALETTE } from '@/utils/theme/colors';
import { Box, Container, IconButton, Paper, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { getServerT } from '@/i18n';
import Link from 'next/link';
import { getPrescriptions } from '@/utils/requests/getPrescriptions';
import { PrescriptionMeds } from '@/components/Docs/Prescriptions/PrescriptionMeds';
import { CompletedMeds } from '@/components/Docs/Prescriptions/CompletedMeds';
import { ColumnBoxStyles } from '@/utils/consts';

export default async function PrescriptionItemPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: paramsId } = await params;
    const t = await getServerT();

    const prescription = await getPrescriptions(paramsId);

    if (!prescription) {
        return (
            <Container>
                <Link href="/docs/analysis">
                    <IconButton
                        sx={{
                            width: '30px',
                            height: '30px',
                            background: PALETTE.ICON_CONTAINER_DARK_GREEN,
                            borderRadius: '20px',
                            fontSize: '18px',
                        }}
                    >
                        <ArrowBack fontSize="inherit" />
                    </IconButton>
                </Link>
                <Paper sx={{ p: 3 }}>Something went wrong.</Paper>
            </Container>
        );
    }

    const completedMeds = prescription.meds.filter(
        ({ medId, scheduleId }) => !!medId && !!scheduleId
    );
    const inCompletedMeds = prescription.meds.filter(
        ({ medId, scheduleId }) => !medId || !scheduleId
    );

    return (
        <Container>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Link href="/docs/prescriptions">
                    <IconButton
                        sx={{
                            width: '40px',
                            height: '40px',
                            background: PALETTE.ICON_CONTAINER_DARK_GREEN,
                            borderRadius: '20px',
                            fontSize: '22px',
                        }}
                    >
                        <ArrowBack fontSize="inherit" />
                    </IconButton>
                </Link>
                <Box>
                    <Typography variant="h2" fontSize="22px" mb={1}>
                        {t('Prescription Details')}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {prescription.date}
                    </Box>
                </Box>
            </Box>
            {!!inCompletedMeds.length && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 5 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography variant="h3">{t('To Review')}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {prescription.meds.length - completedMeds.length} {t('items')}
                        </Typography>
                    </Box>
                    <PrescriptionMeds prescriptionId={prescription.id} meds={inCompletedMeds} />
                </Box>
            )}
            {!!completedMeds.length && (
                <Box mt={5}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography variant="h3">{t('Added')}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {completedMeds.length} {t('items')}
                        </Typography>
                    </Box>
                    <Box sx={ColumnBoxStyles} pt={2}>
                        <CompletedMeds prescriptionMeds={completedMeds} />
                    </Box>
                </Box>
            )}
        </Container>
    );
}
