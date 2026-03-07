'use client';

import { type Med } from '@/types';
import { Box, Drawer, IconButton } from '@mui/material';
import { type FC, memo, useCallback, useState } from 'react';
import { useI18n } from '../I18nProvider';
import { AddMedicationStepChooser, AddMedicationSteps } from './utils/steps';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PALETTE } from '@/utils/theme/colors';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

interface IAddMedicationProps {
    open: boolean;
    onClose: () => void;
}

export const AddMedication: FC<IAddMedicationProps> = memo(({ open, onClose }) => {
    const [step, setStep] = useState(AddMedicationStepChooser.AddMedication);
    const [medData, setMedData] = useState<Partial<Med>>({});
    const { t } = useI18n();

    const Component = AddMedicationSteps[step].content;

    const changeMedData = useCallback((newMedData: Partial<Med>) => {
        setMedData((prevData) => {
            return {
                ...prevData,
                ...newMedData,
            };
        });
    }, []);

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
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
                    <Component setStep={setStep} medData={medData} changeMedData={changeMedData} />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        pt: 4,
                        pb: 2,
                        fontSize: '13px',
                        color: PALETTE.BRAND_TEAL_DARK_PALE,
                    }}
                >
                    <Box fontSize="16px">
                        <VerifiedUserOutlinedIcon fontSize="inherit" />
                    </Box>
                    {t('Your data stays private.')}
                </Box>
            </Box>
        </Drawer>
    );
});
