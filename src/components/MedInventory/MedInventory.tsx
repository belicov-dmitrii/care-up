'use client';

import { RowBoxStyles, ColumnBoxStyles, PaperStyles } from '@/utils/consts';
import { PALETTE } from '@/utils/theme/colors';
import {
    Paper,
    Typography,
    Box,
    Button,
    Stack,
    alpha,
    type CSSProperties,
    Modal,
    TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { type Med } from '@/types';
import { type Dispatch, memo, useState, type FC, type SetStateAction, useCallback } from 'react';
import { useI18n } from '../I18nProvider';
import { NetworkRequest } from '@/utils/NetworkRequest';

interface IPharmacyInventoryProps {
    med: Med;
}

const roundedButtonStyles: CSSProperties = {
    width: 52,
    height: 52,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: PALETTE.BRAND_TEAL,
    fontSize: 24,
    borderRadius: '100%',
    backgroundColor: alpha(PALETTE.BRAND_TEAL, 0.1),
    flex: '0 0 auto',
    minWidth: 52,
};

type InventoryUpdateAction = 'add' | 'remove' | '';

export const MedInventory: FC<IPharmacyInventoryProps> = memo(({ med }) => {
    const { t } = useI18n();
    const [inventory, setInventory] = useState<number>(med.remaining);
    const [updateInventory, setUpdateInventory] = useState<InventoryUpdateAction>('');

    const handleInventoryModalChange = (action: InventoryUpdateAction) => {
        setUpdateInventory(action);
    };

    const handleInventorySave = useCallback(
        async (action: InventoryUpdateAction, value: number) => {
            const delta = action === 'add' ? value : -value;
            const nextInventory = Math.max(inventory + delta, 0);

            const res = await NetworkRequest(
                '/update-med',
                {
                    id: med.id,
                    remaining: nextInventory,
                },
                { method: 'PATCH' }
            );

            if (!res.ok) return;

            setInventory(nextInventory);
        },
        [med.id, inventory]
    );

    return (
        <Paper sx={PaperStyles}>
            <Typography variant="h3" fontSize={16}>
                {t('Inventory')}
            </Typography>
            <Box sx={{ ...RowBoxStyles, justifyContent: 'center', gap: 3 }}>
                <Button
                    sx={roundedButtonStyles}
                    onClick={() => handleInventoryModalChange('remove')}
                >
                    <RemoveIcon />
                </Button>
                <Stack>
                    <Typography variant="body1" sx={{ fontSize: 40, fontWeight: 600 }}>
                        {inventory}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >{`${med.form} ${t('Remaining')}`}</Typography>
                </Stack>
                <Button sx={roundedButtonStyles} onClick={() => handleInventoryModalChange('add')}>
                    <AddIcon />
                </Button>
            </Box>
            <UpdateInventoryModal
                open={updateInventory}
                setOpen={setUpdateInventory}
                onSave={handleInventorySave}
            />
        </Paper>
    );
});

const UpdateInventoryModal = ({
    open,
    setOpen,
    onSave,
}: {
    open: InventoryUpdateAction;
    setOpen: Dispatch<SetStateAction<InventoryUpdateAction>>;
    onSave: (action: InventoryUpdateAction, newInventory: number) => void;
}) => {
    const { t } = useI18n();
    const [value, setValue] = useState('');

    const close = () => {
        let newValue = Number(value);

        if (!value || Number.isNaN(newValue)) {
            newValue = 0;
        }

        onSave(open, newValue);

        setValue('');
        setOpen('');
    };

    const handleInventoryChange = (remaining: string) => {
        setValue(remaining?.trim());
    };

    return (
        <Modal
            open={!!open}
            onClose={(_, reason) => {
                if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
                    return;
                }
                close();
            }}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <Box
                sx={{
                    ...ColumnBoxStyles,
                    backgroundColor: PALETTE.BRAND_WHITE,
                    width: '95%',
                    maxWidth: '600px',
                    borderRadius: '14px',
                    padding: 3,
                }}
            >
                <Typography variant="h3" sx={{ textTransform: 'capitalize' }}>
                    {t(`${open} medication`)}
                </Typography>
                <TextField
                    autoFocus
                    type="number"
                    value={value}
                    onChange={(e) => handleInventoryChange(e.target.value)}
                />
                <Button onClick={close}>{t('Save')}</Button>
            </Box>
        </Modal>
    );
};
