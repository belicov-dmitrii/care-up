'use client';

import { RowBoxStyles, ColumnBoxStyles } from '@/utils/consts';
import { formatMedExpirationDate } from '@/utils/formatData';
import { PALETTE } from '@/utils/theme/colors';
import {
    Paper,
    Typography,
    Box,
    Button,
    Stack,
    Divider,
    alpha,
    type CSSProperties,
    TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { type Med } from '@/types';
import { type Dispatch, memo, useState, type FC, type SetStateAction } from 'react';
import { useI18n } from '../I18nProvider';

interface IPharmacyItemFormProps {
    med: Med;
}

const paperStyles: CSSProperties = {
    ...ColumnBoxStyles,
    width: '100%',
    padding: 3,
    borderRadius: '14px',
};

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

const actionButtonStyle: CSSProperties = {
    ...RowBoxStyles,
    color: 'text.primary',
    justifyContent: 'space-between',
    textAlign: 'left',
    gap: 0.2,
};

const noteMock =
    'Take with a meal containing fats for better absorption. Keep in a cool, dry place away from direct sunlight.';

export const PharmacyItemForm: FC<IPharmacyItemFormProps> = memo(({ med }) => {
    const { t } = useI18n();
    const [inventory, setInventory] = useState<number>(med.remaining);
    const [note, setNote] = useState<string>(noteMock);

    const saveItem = () => {
        console.log({
            ...med,
            remaining: inventory,
            note,
        });
    };

    const deleteItem = () => {
        console.log({
            ...med,
            remaining: inventory,
            note,
        });
    };

    return (
        <>
            <Inventory med={med} inventory={inventory} setInventory={setInventory} />
            <Paper sx={paperStyles}>
                <Button sx={actionButtonStyle}>
                    <Box sx={{ ...RowBoxStyles, gap: 2 }}>
                        <Box
                            className="icon-container"
                            sx={{
                                backgroundColor: alpha(PALETTE.BRAND_TEAL, 0.1),
                                color: PALETTE.BRAND_TEAL,
                                width: 44,
                                height: 44,
                            }}
                        >
                            <PendingActionsIcon />
                        </Box>
                        <Stack gap={0.5}>
                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary', fontSize: 12, fontWeight: 600 }}
                            >
                                {t('Expiry Date')}
                            </Typography>
                            <Typography variant="body1">
                                {formatMedExpirationDate(med.expirationDate)}
                            </Typography>
                        </Stack>
                    </Box>
                    <ArrowForwardIosIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                </Button>
                <Divider />
                <Button sx={actionButtonStyle}>
                    <Box sx={{ ...RowBoxStyles, gap: 2 }}>
                        <Box
                            className="icon-container"
                            sx={{
                                backgroundColor: alpha(PALETTE.WARNING, 0.1),
                                color: PALETTE.WARNING,
                                width: 44,
                                height: 44,
                            }}
                        >
                            <NotificationsNoneIcon />
                        </Box>
                        <Stack gap={0.5}>
                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary', fontSize: 12, fontWeight: 600 }}
                            >
                                {t('Low Stock Alert')}
                            </Typography>
                            <Typography variant="body1">{t('Remind at 20 remaining')}</Typography>
                        </Stack>
                    </Box>
                    <ArrowForwardIosIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                </Button>
            </Paper>
            <Note note={note} setNote={setNote} />
            <Box sx={{ ...ColumnBoxStyles, width: '100%', mt: 3 }}>
                <Button variant="contained" size="large" onClick={saveItem}>
                    {t('Save Adjustments')}
                </Button>
                <Button
                    variant="text"
                    size="large"
                    color="error"
                    onClick={deleteItem}
                >
                    {t('Delete Item')}
                </Button>
            </Box>
        </>
    );
});

const Inventory = ({
    med,
    inventory,
    setInventory,
}: {
    med: Med;
    inventory: number;
    setInventory: Dispatch<SetStateAction<number>>;
}) => {
    const { t } = useI18n();

    const handleInventoryChange = (action: 'add' | 'remove') => {
        if (action === 'add') {
            setInventory((prev) => prev + 1);
            return;
        }

        setInventory((prev) => prev - 1);
    };

    return (
        <Paper sx={paperStyles}>
            <Typography variant="h3" fontSize={16}>
                {t('Inventory')}
            </Typography>
            <Box sx={{ ...RowBoxStyles, justifyContent: 'center', gap: 3 }}>
                <Button sx={roundedButtonStyles} onClick={() => handleInventoryChange('remove')}>
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
                <Button sx={roundedButtonStyles} onClick={() => handleInventoryChange('add')}>
                    <AddIcon />
                </Button>
            </Box>
            <Divider />
            <Button
                sx={{
                    backgroundColor: alpha(PALETTE.BRAND_TEAL, 0.1),
                    alignSelf: 'center',
                    gap: 1,
                    padding: '0 24px',
                }}
            >
                <AssignmentAddIcon sx={{ fontSize: 18 }} />
                <Typography variant="body1" sx={{ fontSize: 15, fontWeight: 600 }}>
                    {t('Log Refill')}
                </Typography>
            </Button>
        </Paper>
    );
};

const Note = ({ note, setNote }: { note: string; setNote: Dispatch<SetStateAction<string>> }) => {
    const { t } = useI18n();
    const [edit, setEdit] = useState<boolean>(false);

    const handleEditChange = () => {
        setEdit((prev) => !prev);
    };

    const handleNoteChange = (newNote: string) => {
        setNote(newNote);
    };

    return (
        <Paper sx={{ ...paperStyles, textAlign: 'left', gap: 1 }}>
            <Box sx={{ ...RowBoxStyles, justifyContent: 'space-between' }}>
                <Typography variant="h3" fontSize={16}>
                    {t('Notes')}
                </Typography>
                <Button variant="text" size="small" onClick={handleEditChange}>
                    {edit ? t('Save') : t('Edit')}
                </Button>
            </Box>
            {edit ? (
                <TextField
                    placeholder={t('Enter note...')}
                    multiline
                    rows={4}
                    value={note}
                    slotProps={{
                        input: {
                            sx: {
                                height: 122,
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: 15,
                                padding: 2,
                            },
                        },
                    }}
                    onChange={(e) => handleNoteChange(e.target.value)}
                />
            ) : (
                <Box
                    sx={{
                        padding: 2,
                        backgroundColor: PALETTE.BG_PAGE,
                        color: 'text.secondary',
                        borderRadius: '12px',
                        fontSize: 15,
                        height: 122,
                    }}
                >
                    {note}
                </Box>
            )}
        </Paper>
    );
};
