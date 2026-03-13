import { TimePicker } from '@/libs/time-picker';
import { Modal, Box } from '@mui/material';
import { type FC, type Dispatch, type SetStateAction, memo } from 'react';
import { CreateScheduleActionTypes, type CreateScheduleDispatch } from './reducer';

export const AddTimeModal: FC<{
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    dispatch: CreateScheduleDispatch;
}> = memo(({ open, setOpen, dispatch }) => {
    const handleClose = () => {
        setOpen((prev) => !prev);
    };

    const handleSave = (value: string) => {
        dispatch({ type: CreateScheduleActionTypes.AddTime, payload: value });

        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}
            >
                <TimePicker value="10:00" onSave={handleSave} onCancel={handleClose} />
            </Box>
        </Modal>
    );
});
