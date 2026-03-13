import { RowBoxStyles } from '@/utils/consts';
import { formatTime } from '@/utils/formatData';
import { PALETTE } from '@/utils/theme/colors';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import { type FC, memo, type Dispatch, type SetStateAction } from 'react';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { type ScheduleTime } from '@/types';
import { CreateScheduleActionTypes, type CreateScheduleDispatch } from './reducer';
import { type AddTimeModalAction } from './CreateScheduleForm';
import { handleDecimalNumberKeyDown } from '@/utils/keyDownHandlers';

type SelectedTime = ScheduleTime & { dose: string };

export const TimeItem: FC<{
    time: SelectedTime;
    dispatch: CreateScheduleDispatch;
    setAddTimeOpen: Dispatch<SetStateAction<AddTimeModalAction>>;
}> = memo(({ time, dispatch, setAddTimeOpen }) => {
    const { id, hours, minutes, dose } = time;

    const handleDeleteTime = () => {
        dispatch({ type: CreateScheduleActionTypes.DeleteTime, payload: id });
    };

    const handleDoseChange = (dose: string) => {
        dispatch({ type: CreateScheduleActionTypes.UpdateDose, payload: { [id]: dose } });
    };

    const handleUpdateTime = () => {
        setAddTimeOpen({ id, hours, minutes });
    };

    return (
        <Box sx={{ ...RowBoxStyles, justifyContent: 'space-between' }}>
            <Typography variant="body1" onClick={handleUpdateTime}>
                {formatTime(hours, minutes)}
            </Typography>
            <TextField
                value={dose}
                type="number"
                placeholder="0.00"
                sx={{ maxWidth: 70 }}
                slotProps={{
                    input: {
                        sx: {
                            height: 40,
                        },
                        inputMode: 'decimal',
                    },
                    htmlInput: {
                        onKeyDown: handleDecimalNumberKeyDown,
                    },
                }}
                onChange={(e) => handleDoseChange(e.target.value)}
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
            />
            <IconButton onClick={handleDeleteTime} sx={{ color: PALETTE.ERROR }}>
                <DeleteOutlinedIcon />
            </IconButton>
        </Box>
    );
});
