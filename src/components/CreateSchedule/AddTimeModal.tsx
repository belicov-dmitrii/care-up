import { TimePicker } from '@/libs/time-picker';
import { Modal, Box } from '@mui/material';
import { type FC, type Dispatch, type SetStateAction, memo } from 'react';
import { CreateScheduleActionTypes, type CreateScheduleDispatch } from './reducer';
import { type AddTimeModalAction } from './CreateScheduleForm';
import { formatTime } from '@/utils/formatData';
import { isObject } from '@/utils/typeGuards';

export const AddTimeModal: FC<{
    open: AddTimeModalAction;
    setOpen: Dispatch<SetStateAction<AddTimeModalAction>>;
    dispatch: CreateScheduleDispatch;
}> = memo(({ open, setOpen, dispatch }) => {
    const value = isObject(open) ? formatTime(open.hours, open.minutes) : '10:00';
    const handleClose = () => {
        setOpen(null);
    };

    const handleSave = (value: string) => {
        if (!open) return;

        if (open === 'add') {
            dispatch({ type: CreateScheduleActionTypes.AddTime, payload: value });
        } else {
            const [hours, minutes] = value.split(':');
            dispatch({
                type: CreateScheduleActionTypes.UpdateTime,
                payload: { ...open, hours: Number(hours), minutes: Number(minutes) },
            });
        }

        handleClose();
    };

    return (
        <Modal open={!!open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}
            >
                <TimePicker value={value} onSave={handleSave} onCancel={handleClose} />
            </Box>
        </Modal>
    );
});
