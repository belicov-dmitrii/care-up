import { getAnalysis } from '@/utils/requests/getAnalysis';
import { PALETTE } from '@/utils/theme/colors';
import { Box, Container, IconButton, Paper, Stack, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { getServerT } from '@/i18n';
import { DocsStatus } from '@/components/Docs/DocsStatus';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ANALYSIS_ITEM_STYLES } from '@/components/Docs/utils/const';

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: paramsId } = await params;
    const t = await getServerT();

    const analysis = await getAnalysis(paramsId);

    if (!analysis) {
        return (
            <Container sx={{ p: 3, pt: 4 }}>
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

    return (
        <Container sx={{ p: 3, pt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Link href="/docs/analysis">
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
                        {t('Analysis')} - {analysis.date}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <DocsStatus status={analysis.status} />
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 5 }}>
                {analysis.items.map((item) => {
                    const styles = ANALYSIS_ITEM_STYLES[item.status];

                    return (
                        <Link href={`/docs/analysis/${analysis.id}/${item.id}`} key={item.id}>
                            <Paper
                                sx={{
                                    p: 3,
                                    background: styles.container,
                                    borderRadius: '14px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Box sx={{ flex: '2 2' }}>
                                    <Typography variant="h3">{item.title}</Typography>
                                    <Stack sx={{ color: styles.text }}>
                                        <Box>
                                            <Typography color="text.secondary">{`${item.value.amount} ${item.value.unit}`}</Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                                gap: 1,
                                                mt: 2.5,
                                            }}
                                        >
                                            {styles.icon}
                                            <Typography sx={{ lineHeight: 1.1 }}>
                                                {styles.title}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                                <Box sx={{ color: styles.text }}>
                                    <ArrowForwardIcon color="inherit" />
                                </Box>
                            </Paper>
                        </Link>
                    );
                })}
            </Box>
        </Container>
    );
}
