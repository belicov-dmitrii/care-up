import { CreateScheduleForm } from '@/components/CreateSchedule/CreateScheduleForm';
import { ColumnBoxStyles } from '@/utils/consts';
import { Box, Container, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState, type FC } from 'react';
import { useI18n } from '../I18nProvider';
import { type Med } from '@/types';
import { NetworkRequest } from '@/utils/NetworkRequest';
import { AddMedicationButton } from '../AddMedication/AddMedicationButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ICreateScheduleProps {
    id?: string;
    open: boolean;
    onClose: () => void;
}

export const CreateSchedule: FC<ICreateScheduleProps> = ({ id, open, onClose }) => {
    const { t } = useI18n();
    const [meds, setMeds] = useState<Med[]>([]);

    useEffect(() => {
        const getMeds = async () => {
            const { data, ok } = await NetworkRequest('/meds', {}, { method: 'POST' });

            if (!ok) return;

            setMeds(data as Med[]);
        };

        getMeds();
    }, []);

    const closeDrawer = useCallback(() => {
        onClose();
    }, [onClose]);

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Container sx={{ ...ColumnBoxStyles, p: 3, width: '100%' }}>
                <Box mb={3}>
                    <IconButton onClick={onClose} sx={{ padding: 0, color: '#000' }}>
                        <ArrowBackIcon />
                    </IconButton>
                </Box>
                {!meds.length ? (
                    <Box>
                        <Typography variant="body1" sx={{ fontSize: 14, color: 'text.secondary' }}>
                            {t('Add your first medication.')}
                        </Typography>
                        <AddMedicationButton />
                    </Box>
                ) : (
                    <Box>
                        <Stack gap={1} mb={2}>
                            <Typography variant="h1">{t('Create Schedule')}</Typography>
                            <Typography
                                variant="body1"
                                sx={{ fontSize: 14, color: 'text.secondary' }}
                            >
                                {t('Set when this medication should be taken.')}
                            </Typography>
                        </Stack>
                        <CreateScheduleForm id={id} meds={meds} closeDrawer={closeDrawer} />
                    </Box>
                )}
            </Container>
        </Drawer>
    );
};
