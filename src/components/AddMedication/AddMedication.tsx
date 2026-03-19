'use client';

import { type Med } from '@/types';
import { Box, Drawer, IconButton } from '@mui/material';
import { type FC, memo, useCallback, useEffect, useState } from 'react';
import { AddMedicationSteps } from './utils/AddMedicationSteps';
import { AddMedicationStepChooser } from './utils/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PALETTE } from '@/utils/theme/colors';
import { useRouter } from 'next/navigation';

interface IAddMedicationProps {
    open: boolean;
    onClose: () => void;
}

export const AddMedication: FC<IAddMedicationProps> = memo(({ open, onClose }) => {
    const [step, setStep] = useState(AddMedicationStepChooser.AddMedication);
    const [medData, setMedData] = useState<Partial<Med>>({});
    const router = useRouter();

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

    const onCloseAndRefresh = useCallback(() => {
        onClose();
        router.refresh();
    }, [onClose, router]);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onCloseAndRefresh}
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
                    <IconButton onClick={onCloseAndRefresh} sx={{ padding: 0, color: '#000' }}>
                        <ArrowBackIcon />
                    </IconButton>
                </Box>
                <Box sx={{ flex: '1 1' }}>
                    <Component
                        setStep={setStep}
                        medData={medData}
                        changeMedData={changeMedData}
                        closeMedicationDrawer={onCloseAndRefresh}
                    />
                </Box>
            </Box>
        </Drawer>
    );
});
