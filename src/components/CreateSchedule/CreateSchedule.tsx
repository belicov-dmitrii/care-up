import { CreateScheduleForm } from '@/components/CreateSchedule/CreateScheduleForm';
import { ColumnBoxStyles } from '@/utils/consts';
import {
    Box,
    CircularProgress,
    Container,
    Drawer,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import { useCallback, useEffect, useState, type FC } from 'react';
import { useI18n } from '../I18nProvider';
import { type ScheduleItem, type Med } from '@/types';
import { NetworkRequest } from '@/utils/NetworkRequest';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PALETTE } from '@/utils/theme/colors';
import { PillIcon } from '../icons/PillIcon';
import { sleep } from '@/utils/sleep';

interface ICreateScheduleProps {
    id?: string;
    open: boolean;
    onClose: () => void;
    submitCallback?: (scheduleId: string) => Promise<void>;
    scheduleData?: Partial<ScheduleItem>;
    noMedChoose?: boolean;
}

export const CreateSchedule: FC<ICreateScheduleProps> = ({
    id,
    open,
    noMedChoose,
    scheduleData,
    onClose,
    submitCallback,
}) => {
    const { t } = useI18n();
    const [isSubmitting, setIsSubmitting] = useState(true);
    const [meds, setMeds] = useState<Med[]>([]);

    useEffect(() => {
        (async () => {
            const { data, ok } = await NetworkRequest('/meds', {}, { method: 'POST' });

            if (!ok) return;

            setMeds(data as Med[]);
            await sleep(1000);

            setIsSubmitting(false);
        })();
    }, []);

    const closeDrawer = useCallback(() => {
        onClose();
    }, [onClose]);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            slotProps={{ paper: { style: { width: '100%' } } }}
        >
            {isSubmitting ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <CircularProgress size={70} color="primary" />
                </Box>
            ) : (
                <Container sx={{ ...ColumnBoxStyles, p: 3, width: '100%' }}>
                    <Box mb={3}>
                        <IconButton onClick={onClose} sx={{ padding: 0, color: '#000' }}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Box>
                    {!meds.length ? (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Box>
                                <Box
                                    sx={{
                                        p: 4,
                                        fontSize: '160px',
                                        margin: '0 auto',
                                        display: 'inline-block',
                                        background: PALETTE.ICON_CONTAINER_YELLOW,
                                        borderRadius: '200px',
                                        color: PALETTE.ICON_YELLOW,
                                    }}
                                >
                                    <PillIcon />
                                </Box>
                            </Box>
                            <Typography variant="h4" textAlign="center">
                                {t('Add your first medication before creating a schedule.')}
                            </Typography>
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
                            <CreateScheduleForm
                                id={id}
                                meds={meds}
                                noMedChoose={noMedChoose}
                                scheduleData={scheduleData}
                                closeDrawer={closeDrawer}
                                submitCallback={submitCallback}
                            />
                        </Box>
                    )}
                </Container>
            )}
        </Drawer>
    );
};
