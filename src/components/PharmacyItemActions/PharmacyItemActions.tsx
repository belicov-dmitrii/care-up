'use client';

import { ColumnBoxStyles } from '@/utils/consts';
import { NetworkRequest } from '@/utils/NetworkRequest';
import { Box, Button } from '@mui/material';
import { type FC } from 'react';
import { useI18n } from '../I18nProvider';
import { useRouter } from 'next/navigation';
import { PALETTE } from '@/utils/theme/colors';

interface IPharmacyItemActionsProps {
    id: string;
}

export const PharmacyItemActions: FC<IPharmacyItemActionsProps> = ({ id }) => {
    const { t } = useI18n();
    const router = useRouter();

    const handleDelete = async () => {
        const res = await NetworkRequest('/delete-med', { id }, { method: 'DELETE' });

        if (!res.ok) return;

        router.push('/pharmacy');
    };

    return (
        <Box sx={{ ...ColumnBoxStyles, width: '100%', mt: 3 }}>
            <Button variant="contained" size="large">
                {t('Create Schedule')}
            </Button>
            <Button
                variant="text"
                size="large"
                sx={{ color: PALETTE.ERROR }}
                onClick={handleDelete}
            >
                {t('Delete Item')}
            </Button>
        </Box>
    );
};
