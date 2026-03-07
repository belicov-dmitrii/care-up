import { type FC } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useI18n } from '../I18nProvider';
import { type IAddMedicationChildProps } from './utils/types';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { AddMedicationStepChooser } from './utils/steps';
import { PALETTE } from '@/utils/theme/colors';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const PAPER_STYLES = {
    p: 4,
    borderRadius: '16px',
};

export const PhotoOrManual: FC<IAddMedicationChildProps> = ({ setStep }) => {
    const { t } = useI18n();

    return (
        <Box>
            <Typography variant="h1">{t('Add Medication')}</Typography>
            <Typography color="text.secondary" mb={6} mt={1}>
                {t("Choose how you'd like to add it.")}
            </Typography>
            <Box>
                <Paper
                    onClick={() => setStep(AddMedicationStepChooser.PhotoAdding)}
                    sx={{ ...PAPER_STYLES, mb: 3 }}
                >
                    <Box
                        bgcolor={PALETTE.BUTTON_BG_TEAL}
                        sx={{ color: PALETTE.ICON_GREEN, mb: 2 }}
                        className="icon-container"
                    >
                        <CameraAltOutlinedIcon fontSize="inherit" />
                    </Box>
                    <Typography variant="h4" sx={{ fontSize: '18px', fontWeight: 600 }} mb={1}>
                        {t('Take a photo')}
                    </Typography>
                    <Typography sx={{ fontSize: '15px' }} color="text.secondary">
                        {t("Capture the package or label. We'll help you fill in the details.")}
                    </Typography>
                    <Box
                        bgcolor="background.default"
                        mt="14px"
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            p: '6px 12px',
                            borderRadius: 2,
                            color: PALETTE.BRAND_TEAL_DARK_PALE,
                            fontSize: '13px',
                        }}
                    >
                        <Box fontSize="20px">
                            <EditOutlinedIcon fontSize="inherit" />
                        </Box>
                        {t('You can edit everything later.')}
                    </Box>
                </Paper>
                <Paper
                    onClick={() => setStep(AddMedicationStepChooser.ManualAdding)}
                    sx={PAPER_STYLES}
                >
                    <Box
                        bgcolor={PALETTE.BUTTON_BG_LAVANDER}
                        sx={{ color: PALETTE.ICON_PURPLE, mb: 2 }}
                        className="icon-container"
                    >
                        <DriveFileRenameOutlineIcon fontSize="inherit" />
                    </Box>
                    <Typography variant="h4" sx={{ fontSize: '18px', fontWeight: 600 }} mb={1}>
                        {t('Add manually')}
                    </Typography>
                    <Typography sx={{ fontSize: '15px' }} color="text.secondary">
                        {t('Enter the medication details yourself.')}
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
};
