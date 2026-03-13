import { AnalysisIcon } from '@/components/icons/AnalysisIcon';
import { PillIcon } from '@/components/icons/PillIcon';
import { getServerT } from '@/i18n';
import { PALETTE } from '@/utils/theme/colors';
import { ArrowForwardIos } from '@mui/icons-material';
import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import Link from 'next/link';

const items = [
    {
        link: 'analysis',
        title: 'Analysis',
        icon: <AnalysisIcon />,
        iconContainerColor: PALETTE.ICON_CONTAINER_DARK_GREEN,
        iconColor: PALETTE.ICON_DARK_GREEN,
    },
    {
        link: 'prescriptions',
        title: 'Prescriptions',
        icon: <PillIcon />,
        iconContainerColor: PALETTE.ICON_CONTAINER_YELLOW,
        iconColor: PALETTE.ICON_YELLOW,
    },
];

export default async function DocsPage() {
    const t = await getServerT();

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: 3 }}>
            <Stack textAlign="center">
                <Typography variant="h1" mb={2}>
                    {t('Medication Plan')}
                </Typography>
                <Typography variant="h3" color="text.secondary" fontSize="16px">
                    {t('Here you can find your medical data or set up new Medication Plan')}
                </Typography>
            </Stack>
            {items.map(({ link, title, iconColor, icon, iconContainerColor }) => {
                return (
                    <Link href={`/docs/${link}`} key={link}>
                        <Paper
                            sx={{
                                p: 3,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        background: iconContainerColor,
                                        color: iconColor,
                                        fontSize: '24px',
                                        borderRadius: '20px',
                                        width: '48px',
                                        height: '48px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {icon}
                                </Box>
                                <Typography variant="h4" fontSize="16px">
                                    {t(title)}
                                </Typography>
                            </Box>
                            <Box sx={{ color: PALETTE.BRAND_GREY }}>
                                <ArrowForwardIos />
                            </Box>
                        </Paper>
                    </Link>
                );
            })}
            <Paper></Paper>
        </Container>
    );
}
