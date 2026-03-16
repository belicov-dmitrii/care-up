import { DocsStatus } from '@/components/Docs/DocsStatus';
import { getServerT } from '@/i18n';
import { getPrescriptions } from '@/utils/requests/getPrescriptions';
import { Box, Container, IconButton, Paper, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PALETTE } from '@/utils/theme/colors';
import Link from 'next/link';
import { AddAnalysisOrPrescription } from '@/components/Docs/Analysis/AddAnalysis';

export default async function PrescriptionPage() {
    const t = await getServerT();
    const prescriptions = await getPrescriptions();

    return (
        <Container sx={{ p: 3, pt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h1">{t('Prescriptions')}</Typography>
                <AddAnalysisOrPrescription type="prescriptions" />
            </Box>
            <Box mt={3} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {prescriptions.map((prescription) => {
                    const isProcessing = prescription.status === 'processing';

                    const body = (
                        <Paper
                            sx={{
                                p: 3,
                                display: 'flex',
                                justifyContent: 'space-between',
                                opacity: isProcessing ? 0.7 : 1,
                                alignItems: 'center',
                                borderRadius: '14px',
                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
                            }}
                            key={prescription.id}
                        >
                            <Box>
                                <Typography variant="h3" mb={2}>
                                    {t('Prescription')}-{prescription.date}
                                </Typography>
                                <DocsStatus status={prescription.status} />
                            </Box>
                            {!isProcessing && (
                                <IconButton
                                    sx={{
                                        width: '30px',
                                        height: '30px',
                                        background: PALETTE.ICON_CONTAINER_DARK_GREEN,
                                        borderRadius: '20px',
                                        fontSize: '18px',
                                    }}
                                >
                                    <ArrowForwardIcon fontSize="inherit" />
                                </IconButton>
                            )}
                        </Paper>
                    );

                    if (isProcessing) {
                        return body;
                    }

                    return (
                        <Link href={`/docs/prescriptions/${prescription.id}`} key={prescription.id}>
                            {body}
                        </Link>
                    );
                })}
            </Box>
        </Container>
    );
}
