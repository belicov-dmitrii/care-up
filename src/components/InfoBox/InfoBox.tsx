'use client';

import { PALETTE } from '@/utils/theme/colors';
import { CheckBox } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';

export const InfoBox = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                backgroundColor: PALETTE.BRAND_WHITE,
                padding: 3,
                borderRadius: '22px',
                textAlign: 'left',
                gap: 2,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 48,
                    minWidth: 48,
                    backgroundColor: PALETTE.BRAND_TEAL_LIGHT,
                    borderRadius: '50%',
                }}
            >
                <CheckBox />
            </Box>
            <Stack gap={1}>
                <Typography variant="h3" sx={{ fontSize: 18, fontWeight: 600 }}>
                    Title
                </Typography>
                <Typography variant="body2" fontSize={15}>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corrupti odio
                    doloremque blanditiis et voluptatem ad ipsa quia eius nulla suscipit voluptates
                    inventore.
                </Typography>
            </Stack>
        </Box>
    );
};
