'use client';

import { Box, Container, Drawer, IconButton, Paper, Typography } from '@mui/material';
import { memo, useCallback, useState } from 'react';
import { PALETTE } from '@/utils/theme/colors';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { MedDrawer } from './MedDrawer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useI18n } from '../I18nProvider';

export const Maps = memo(() => {
    const [drawerIsOpen, setDrawerOpen] = useState(false);
    const { t } = useI18n();

    const toggleDrawer = useCallback(() => {
        return setDrawerOpen((prev) => !prev);
    }, []);

    return (
        <Box>
            <Box
                onClick={toggleDrawer}
                sx={{
                    position: 'fixed',
                    bottom: '150px',
                    right: '10px',
                    width: '44px',
                    height: '44px',
                    fontSize: '25px',
                    color: '#FFF',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '100px',
                    zIndex: 99,
                    background: PALETTE.BRAND_TEAL,
                }}
            >
                <LocationOnIcon fontSize="inherit" color="inherit" />
            </Box>
            <Drawer
                open={drawerIsOpen}
                onClose={toggleDrawer}
                anchor="right"
                slotProps={{ paper: { style: { width: '100%' } } }}
            >
                <Container sx={{ p: 2, height: 'calc(100% - 100px)' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                        }}
                        onClick={toggleDrawer}
                    >
                        <IconButton
                            sx={{
                                width: '30px',
                                height: '30px',
                                background: PALETTE.ICON_CONTAINER_DARK_GREEN,
                                borderRadius: '20px',
                                fontSize: '18px',
                            }}
                        >
                            <ArrowBackIcon fontSize="inherit" />
                        </IconButton>
                        <Typography ml={4} variant="h2">
                            {t('Find pharmacies near you')}
                        </Typography>
                    </Box>
                    <Paper sx={{ p: 1, width: '100%', height: '100%', borderRadius: '14px' }}>
                        <MedDrawer />
                    </Paper>
                </Container>
            </Drawer>
        </Box>
    );
});
