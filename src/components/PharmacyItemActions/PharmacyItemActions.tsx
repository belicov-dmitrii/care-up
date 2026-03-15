'use client';

import { ColumnBoxStyles, RowBoxStyles } from '@/utils/consts';
import { NetworkRequest } from '@/utils/NetworkRequest';
import { Box, Button, Modal, Typography } from '@mui/material';
import { useState, type FC } from 'react';
import { useI18n } from '../I18nProvider';
import { useRouter } from 'next/navigation';
import { PALETTE } from '@/utils/theme/colors';
import { CreateScheduleAction } from '../CreateSchedule/CreateScheduleAction';

interface IPharmacyItemActionsProps {
    id: string;
}

export const PharmacyItemActions: FC<IPharmacyItemActionsProps> = ({ id }) => {
    const { t } = useI18n();
    const router = useRouter();
    const [confirm, setConfirm] = useState(false);

    const handleConfirmation = (isYes: boolean) => {
        return async () => {
            if (isYes) {
                const res = await NetworkRequest('/delete-med', { id }, { method: 'DELETE' });

                if (!res.ok) return;

                router.push('/pharmacy');
            }

            setConfirm((prev) => !prev);
        };
    };

    return (
        <Box sx={{ ...ColumnBoxStyles, width: '100%', mt: 3 }}>
            <CreateScheduleAction id={id} />
            <Button
                variant="text"
                size="large"
                sx={{ color: PALETTE.ERROR }}
                onClick={() => setConfirm(true)}
            >
                {t('Delete Item')}
            </Button>
            <Modal open={confirm} onClose={handleConfirmation(false)}>
                <Box
                    sx={{
                        ...ColumnBoxStyles,
                        p: 3,
                        backgroundColor: PALETTE.BRAND_WHITE,
                        borderRadius: '14px',
                        width: '90%',
                        maxWidth: 600,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <Typography variant="h3" fontSize={18} fontWeight={400} lineHeight={1.5}>
                        {t('Are you sure you want to delete this medication?')}
                    </Typography>
                    <Box sx={{ ...RowBoxStyles, gap: 2, alignSelf: 'flex-end' }}>
                        <Button
                            variant="text"
                            sx={{ color: PALETTE.ERROR }}
                            onClick={handleConfirmation(false)}
                        >
                            {t('Cancel')}
                        </Button>
                        <Button variant="contained" onClick={handleConfirmation(true)}>
                            {t('Yes')}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};
