import { Box, Button, Container, Typography } from '@mui/material';
import { type FC, memo, useState } from 'react';
import { useI18n } from '../I18nProvider';
import { type IAddMedicationChildProps } from './utils/types';
import { CreateSchedule } from '../CreateSchedule/CreateSchedule';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { PALETTE } from '@/utils/theme/colors';

export const AddMedicationCreateSchedule: FC<IAddMedicationChildProps> = memo(
    ({ medData, closeMedicationDrawer }) => {
        const { t } = useI18n();
        const [openCreateScheduleModal, setOpenCreateScheduleModal] = useState(false);

        if (!medData) {
            return null;
        }

        const closeDrawer = () => {
            setOpenCreateScheduleModal(false);
            closeMedicationDrawer();
        };

        return (
            <Container
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="h2" textAlign="center">
                    {t('Do you want to create a schedule for {med}?', { med: medData.name ?? '' })}
                </Typography>
                <Box>
                    <Box
                        sx={{
                            p: 10,
                            fontSize: '150px',
                            margin: '0 auto',
                            display: 'inline-block',
                            background: PALETTE.ICON_CONTAINER_YELLOW,
                            borderRadius: '200px',
                            color: PALETTE.ICON_YELLOW,
                        }}
                    >
                        <DateRangeIcon fontSize="inherit" color="inherit" />
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <Button
                        onClick={() => setOpenCreateScheduleModal(true)}
                        variant="contained"
                        sx={{ width: '100%' }}
                    >
                        {t('Create Schedule')}
                    </Button>
                    <Button onClick={() => setOpenCreateScheduleModal(true)}>
                        {t('I will add it later')}
                    </Button>
                </Box>
                <CreateSchedule
                    open={openCreateScheduleModal}
                    onClose={closeDrawer}
                    id={medData.id}
                />
            </Container>
        );
    }
);
