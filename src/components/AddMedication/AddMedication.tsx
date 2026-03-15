'use client';

import { type Med } from '@/types';
import { Box, Drawer, IconButton } from '@mui/material';
import { type FC, memo, useCallback, useEffect, useState } from 'react';
import { AddMedicationSteps } from './utils/AddMedicationSteps';
import { AddMedicationStepChooser } from './utils/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PALETTE } from '@/utils/theme/colors';

interface IAddMedicationProps {
    open: boolean;
    onClose: () => void;
}

export const AddMedication: FC<IAddMedicationProps> = memo(({ open, onClose }) => {
    const [step, setStep] = useState(AddMedicationStepChooser.AddMedication);
    const [medData, setMedData] = useState<Partial<Med>>({});

    const Component = AddMedicationSteps[step].content;

    const changeMedData = useCallback((newMedData: Partial<Med>) => {
        setMedData((prevData) => {
            return {
                ...prevData,
                ...newMedData,
            };
        });
    }, []);

    useEffect(() => {
        if (!open) {
            // HINT: To wait for Drawer to hide
            setTimeout(() => {
                setStep(AddMedicationStepChooser.AddMedication);
            }, 500);
        }
    }, [open]);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
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
                    <IconButton onClick={onClose} sx={{ padding: 0, color: '#000' }}>
                        <ArrowBackIcon />
                    </IconButton>
                </Box>
                <Box sx={{ flex: '1 1' }}>
                    <Component
                        setStep={setStep}
                        medData={medData}
                        changeMedData={changeMedData}
                        closeMedicationDrawer={onClose}
                    />
                </Box>
            </Box>
        </Drawer>
    );
});
