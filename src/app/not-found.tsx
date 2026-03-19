import { PALETTE } from '@/utils/theme/colors';
import { ArrowBack } from '@mui/icons-material';
import { Box, Container, IconButton, Typography } from '@mui/material';
import Link from 'next/link';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import { getServerT } from '@/i18n';
import { ColumnBoxStyles } from '@/utils/consts';
import '@/styles/globals.scss';

export default async function NotFoundPage() {
    const t = await getServerT();

    return (
        <Container
            sx={{
                ...ColumnBoxStyles,
                justifyContent: 'center',
                p: 3,
                pt: 4,
                height: '100%',
            }}
        >
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
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                    sx={{
                        fontSize: '40px',
                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: PALETTE.ICON_CONTAINER_YELLOW,
                        width: '96px',
                        height: '96px',
                        borderRadius: '100px',
                        color: PALETTE.ICON_YELLOW,
                    }}
                >
                    <LocationOffIcon fontSize="inherit" color="inherit" />
                </Box>
            </Box>
            <Typography variant="h2" textAlign="center">
                {t('Page not found')}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
                {t(
                    "We couldn't find the page you're looking for. It might have been moved or doesn't exist."
                )}
            </Typography>
        </Container>
    );
}
