import { Box, Button } from '@mui/material';
import { type FC, useCallback, useState } from 'react';
import { useI18n } from '../I18nProvider';
import { CreateSchedule } from './CreateSchedule';

export const CreateScheduleAction: FC<{ id?: string }> = ({ id }) => {
    const { t } = useI18n();
    const [openDrawer, setOpenDrawer] = useState(false);

    const toggleDrawer = useCallback(() => {
        return setOpenDrawer((prev) => !prev);
    }, []);

    return (
        <Box>
            <Button fullWidth variant="contained" size="large" onClick={toggleDrawer}>
                {t('Create Schedule')}
            </Button>
            <CreateSchedule id={id} open={openDrawer} onClose={toggleDrawer} />
        </Box>
    );
};
