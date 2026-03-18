import { type PrescriptionItem } from '@/types';
import { PALETTE } from '@/utils/theme/colors';
import { alpha, Box, Typography } from '@mui/material';
import { type FC } from 'react';
import { getMeds } from '@/utils/requests/getMeds';
import { mapMeds } from '@/utils/mapMeds';
import { Check, CheckCircleOutlined } from '@mui/icons-material';

export const CompletedMeds: FC<{ prescriptionMeds: Array<PrescriptionItem> }> = async ({
    prescriptionMeds,
}) => {
    const meds = mapMeds(await getMeds());

    return prescriptionMeds.map((prescriptionMed) => {
        const med = meds[prescriptionMed.medId ?? ''];

        return (
            <Box
                key={prescriptionMed.id}
                sx={{
                    p: 2,
                    background: 'transparent',
                    border: `1px solid ${alpha(PALETTE.TEXT_SUCCESS, 0.3)}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: '14px',
                    opacity: 0.7,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box
                        sx={{
                            p: 2,
                            background: PALETTE.ICON_CONTAINER_DARK_GREEN,
                            color: PALETTE.ICON_DARK_GREEN,
                            fontSize: '25px',
                            borderRadius: '20px',
                        }}
                    >
                        <CheckCircleOutlined color="success" />
                    </Box>
                    <Box>
                        <Typography variant="h3" fontSize="16px" mb={1}>
                            {med?.name}
                        </Typography>
                        <Typography>{`${med?.strength} ${med?.unit}`}</Typography>
                    </Box>
                </Box>
                <Box sx={{ color: PALETTE.TEXT_SUCCESS }}>
                    <Check color="inherit" />
                </Box>
            </Box>
        );
    });
};
