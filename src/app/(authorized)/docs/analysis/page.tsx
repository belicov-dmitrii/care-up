import { DocsStatus } from '@/components/Docs/DocsStatus';
import { getServerT } from '@/i18n';
import { getAnalysis } from '@/utils/requests/getAnalysis';
import { Box, Container, IconButton, Paper, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PALETTE } from '@/utils/theme/colors';
import Link from 'next/link';
import { AddAnalysisOrPrescription } from '@/components/Docs/Analysis/AddAnalysis';

export default async function AnalysisPage() {
    const t = await getServerT();
    const analysis = await getAnalysis();

    return (
        <Container sx={{ p: 3, pt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h1">{t('Analysis')}</Typography>
                <AddAnalysisOrPrescription type="analysis" />
            </Box>
            <Box mt={3} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {analysis.map((analysis) => {
                    const isProcessing = analysis.status === 'processing';

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
                            key={analysis.id}
                        >
                            <Box>
                                <Typography variant="h3" mb={2}>
                                    {t('Analysis')}-{analysis.date}
                                </Typography>
                                <DocsStatus status={analysis.status} />
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
                        <Link href={`/docs/analysis/${analysis.id}`} key={analysis.id}>
                            {body}
                        </Link>
                    );
                })}
            </Box>
        </Container>
    );
}
