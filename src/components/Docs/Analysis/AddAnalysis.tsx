'use client';

import { AddButton } from '@/components/AddButton';
import { PALETTE } from '@/utils/theme/colors';
import { Box, Drawer, IconButton, Paper, Typography } from '@mui/material';
import { memo, useCallback, useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PhotoPicker } from '@/components/PhotoPicker/PhotoPicker';
import { NetworkRequest } from '@/utils/NetworkRequest';
import { type Analysis } from '@/types';
import { logError } from '@/utils/logError';
import { useI18n } from '@/components/I18nProvider';
import { useRouter } from 'next/navigation';
import { AnalysisIcon } from '@/components/icons/AnalysisIcon';

export const AddAnalysis = memo(() => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [analysisHasUploaded, setAnalysisHasUploaded] = useState(false);
    const router = useRouter();

    const { t } = useI18n();

    const toggleDrawer = useCallback(() => {
        return setOpenDrawer((prev) => !prev);
    }, []);

    useEffect(() => {
        if (!analysisHasUploaded) {
            return;
        }

        setTimeout(() => {
            router.push('/docs/analysis');
        }, 3000);
    }, [analysisHasUploaded, router]);

    const onUpload = useCallback(async (file: File | null) => {
        try {
            if (!file) return;

            const fd = new FormData();
            fd.append('file', file);

            const { ok } = await NetworkRequest<{ fileName: string; med: Analysis }>(
                '/analysis/create',
                {},
                {
                    method: 'POST',
                    body: fd,
                },
                'formData'
            );

            setAnalysisHasUploaded(true);

            if (!ok) throw new Error('Upload failed');
        } catch (error) {
            logError(error);
        }
    }, []);

    return (
        <Box>
            <AddButton onClick={toggleDrawer} />
            <Drawer
                anchor="right"
                open={openDrawer}
                onClose={toggleDrawer}
                slotProps={{
                    paper: {
                        sx: { width: '100%' },
                    },
                }}
            >
                <Box
                    height="100%"
                    bgcolor={PALETTE.BG_PAGE}
                    p="48px 24px"
                    sx={{ display: 'flex', flexDirection: 'column' }}
                >
                    <Box mb={3}>
                        <IconButton onClick={toggleDrawer} sx={{ padding: 0, color: '#000' }}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ flex: '1 1' }}>
                        <Paper sx={{ p: 3, borderRadius: '14px' }}>
                            {analysisHasUploaded ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                        textAlign: 'center',
                                        gap: 3,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: '150px',
                                            height: '150px',
                                            background: PALETTE.BUTTON_BG_LAVANDER,
                                            color: PALETTE.ICON_PURPLE,
                                            borderRadius: '200px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '90px',
                                        }}
                                    >
                                        <AnalysisIcon />
                                    </Box>
                                    <Typography variant="h2">
                                        {t('Your analysis has started processing.')}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {t('You can check the status on the Analysis Page')}
                                    </Typography>
                                </Box>
                            ) : (
                                <PhotoPicker onUpload={onUpload} />
                            )}
                        </Paper>
                    </Box>
                </Box>
            </Drawer>
        </Box>
    );
});
