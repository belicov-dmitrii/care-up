import { AnalysisItemAction } from '@/components/Docs/Analysis/AnalysisItemAction';
import AnalysisItemReferenceRange from '@/components/Docs/AnalysisItemReferenceRange';
import {
    ANALYSIS_ITEM_RECOMMENDATIONS_STYLES,
    ANALYSIS_ITEM_STYLES,
} from '@/components/Docs/utils/const';
import { getServerT } from '@/i18n';
import { getAnalysis } from '@/utils/requests/getAnalysis';
import { PALETTE } from '@/utils/theme/colors';
import { ArrowBack } from '@mui/icons-material';
import { Box, Container, IconButton, Paper, Stack, Typography } from '@mui/material';
import Link from 'next/link';

interface AnalysisItemPageProps {
    params: Promise<{ id: string; itemId: string }>;
}

export default async function AnalysisItemPage({ params }: AnalysisItemPageProps) {
    const { id: paramsId, itemId } = await params;
    const t = await getServerT();

    const analysis = await getAnalysis(paramsId);

    const selectedItem = analysis?.items.find(({ id }) => id === itemId);
    const styles = selectedItem ? ANALYSIS_ITEM_STYLES[selectedItem?.status] : selectedItem;

    if (!analysis || !itemId || !selectedItem) {
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
                <Paper sx={{ p: 3 }}>{t('Something went wrong.')}</Paper>
            </Container>
        );
    }

    return (
        <Container sx={{ p: 3, pt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Link href={`/docs/analysis/${analysis.id}`}>
                    <IconButton
                        sx={{
                            width: '40px',
                            height: '40px',
                            background: PALETTE.ICON_CONTAINER_DARK_GREEN,
                            borderRadius: '20px',
                            fontSize: '20px',
                        }}
                    >
                        <ArrowBack fontSize="inherit" />
                    </IconButton>
                </Link>
                <Box sx={{ flex: '2 2' }} textAlign="center">
                    <Typography variant="h2" fontSize="22px" mb={1}>
                        {selectedItem.title}
                    </Typography>
                    <Typography fontSize="18px" mb={1} color="text.secondary">
                        {selectedItem.value.amount} {selectedItem.value.unit}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box
                            sx={{
                                background: styles?.container,
                                color: styles?.text,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                p: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '14px',
                            }}
                        >
                            {styles?.icon}
                            <Typography sx={{ lineHeight: 0 }}>{styles?.title}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Paper sx={{ mt: 2, borderRadius: '14px', p: 3 }}>
                <AnalysisItemReferenceRange
                    value={selectedItem.value}
                    referenceRange={selectedItem.referenceRange}
                />
            </Paper>
            <Typography variant="h2" fontSize="22px" sx={{ my: 3 }}>
                {t('Recommendations')}
            </Typography>
            <Box>
                {selectedItem.recommendations.map((recommendation) => {
                    const styles = ANALYSIS_ITEM_RECOMMENDATIONS_STYLES[recommendation.category];

                    return (
                        <Paper
                            key={recommendation.category}
                            sx={{ mb: 2, p: 3, borderRadius: '14px', display: 'flex', gap: 2 }}
                        >
                            <Box
                                sx={{
                                    width: '50px',
                                    height: '50px',
                                    background: styles.container,
                                    color: styles.text,
                                    borderRadius: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '30px',
                                }}
                            >
                                {styles.icon}
                            </Box>
                            <Stack>
                                <Typography fontSize="16px" fontWeight={500} mb={2}>
                                    {recommendation.title}
                                </Typography>
                                <AnalysisItemAction styles={styles} analysisItem={selectedItem} />
                            </Stack>
                        </Paper>
                    );
                })}
            </Box>
        </Container>
    );
}
