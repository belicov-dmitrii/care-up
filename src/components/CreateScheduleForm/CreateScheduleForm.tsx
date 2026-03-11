'use client';

import { type ScheduleTime, ScheduleType, type Med, MedUnit } from '@/types';
import { ColumnBoxStyles, PaperStyles, RowBoxStyles } from '@/utils/consts';
import {
    alpha,
    Box,
    Button,
    Container,
    IconButton,
    MenuItem,
    Modal,
    Paper,
    Select,
    type SelectChangeEvent,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { type Dispatch, memo, type SetStateAction, useState, type FC } from 'react';
import { useI18n } from '../I18nProvider';
import { getMedUnitDetails } from '@/utils/getMedExtendedDetails';
import MedicationIcon from '@mui/icons-material/Medication';
import { PALETTE } from '@/utils/theme/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { TimePicker } from '@/libs/time-picker';
import { formatTime } from '@/utils/formatData';
import { typedObjectKeys } from '@/utils/typedObjectKeys';

interface ICreateScheduleFormProps {
    id?: string;
    meds: Med[];
}

const MedsMenuProps = {
    PaperProps: {
        sx: {
            ...PaperStyles,
            paddingY: '10px',
            paddingX: 1,
            maxHeight: 300,
            width: 350,
            maxWidth: 600,
        },
    },
    slotProps: {
        list: {
            sx: {
                '& .MuiMenuItem-root': { padding: 1 },
            },
        },
    },
};

const FREQUENCY_OPTIONS: ScheduleType[] = [
    ScheduleType.EveryDay,
    ScheduleType.EveryOtherDay,
    ScheduleType.EveryWeek,
    ScheduleType.EveryMonth,
    ScheduleType.SpecificDate,
];

export const CreateScheduleForm: FC<ICreateScheduleFormProps> = memo(({ id, meds }) => {
    const [selectedMedId, setSelectedMedId] = useState<string>(id ?? meds[0].id);
    const [selectedFrequency, setSelectedFrequency] = useState<ScheduleType>(FREQUENCY_OPTIONS[0]);
    const [selectedTimes, setSelectedTimes] = useState<ScheduleTime[]>([]);
    const [addTimeOpen, setAddTimeOpen] = useState<boolean>(false);

    const handleMedChange = (e: SelectChangeEvent) => {
        setSelectedMedId(e.target.value);
    };

    const handleFrequencyChange = (value: ScheduleType) => {
        return () => {
            setSelectedFrequency(value);
        };
    };

    const handleAddTime = () => {
        setAddTimeOpen(true);
    };

    const { t } = useI18n();
    return (
        <Container sx={{ ...ColumnBoxStyles, padding: 0 }}>
            <Paper sx={PaperStyles}>
                <Typography variant="h3" fontSize={16}>
                    {t('Medication')}
                </Typography>
                <Select
                    value={selectedMedId}
                    variant="standard"
                    disableUnderline
                    onChange={handleMedChange}
                    IconComponent={(props) => <ExpandMoreIcon {...props} />}
                    MenuProps={MedsMenuProps}
                >
                    {meds.map((med) => (
                        <MenuItem key={med.id} value={med.id}>
                            <Box sx={{ ...RowBoxStyles, gap: 2 }}>
                                <Box
                                    className="icon-container"
                                    sx={{
                                        backgroundColor: alpha(PALETTE.BRAND_TEAL, 0.1),
                                        color: PALETTE.BRAND_TEAL,
                                        width: 48,
                                        height: 48,
                                        borderRadius: '100%',
                                    }}
                                >
                                    <MedicationIcon />
                                </Box>
                                <Stack gap={1}>
                                    <Typography variant="h3" fontSize={18}>
                                        {med.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {getMedUnitDetails(med, false)}
                                    </Typography>
                                </Stack>
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </Paper>
            <Paper sx={PaperStyles}>
                <Typography variant="h3" fontSize={16}>
                    {t('Intake Frequency')}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {FREQUENCY_OPTIONS.map((option) => {
                        const isActive = selectedFrequency === option;
                        const color = isActive ? PALETTE.BRAND_TEAL : PALETTE.BRAND_GREY;
                        const backgroundColor = isActive
                            ? alpha(PALETTE.BRAND_TEAL, 0.1)
                            : alpha(PALETTE.BRAND_GREY, 0.1);

                        return (
                            <Button
                                key={option}
                                variant="outlined"
                                sx={{
                                    color,
                                    backgroundColor,
                                    border: `1px solid ${isActive ? color : backgroundColor}`,
                                }}
                                onClick={handleFrequencyChange(option)}
                            >
                                {option}
                            </Button>
                        );
                    })}
                </Box>
            </Paper>
            <Paper sx={PaperStyles}>
                <Typography variant="h3" fontSize={16}>
                    {t('Daily Intake Times')}
                </Typography>
                {selectedTimes.map((time) => {
                    return (
                        <TimeItem key={time.id} time={time} setSelectedTimes={setSelectedTimes} />
                    );
                })}
                <Button
                    variant="outlined"
                    sx={{
                        color: PALETTE.BRAND_TEAL,
                        border: `1px dashed ${PALETTE.BRAND_TEAL}`,
                        backgroundColor: alpha(PALETTE.BRAND_TEAL, 0.1),
                    }}
                    onClick={handleAddTime}
                >
                    <AddIcon />
                    {t('Add Time')}
                </Button>
            </Paper>
            <AddTimeModal
                open={addTimeOpen}
                setOpen={setAddTimeOpen}
                setSelectedTimes={setSelectedTimes}
            />
        </Container>
    );
});

const AddTimeModal = ({
    open,
    setOpen,
    setSelectedTimes,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    setSelectedTimes: Dispatch<SetStateAction<ScheduleTime[]>>;
}) => {
    const handleClose = () => {
        console.log('here');
        setOpen((prev) => !prev);
    };

    const handleSave = (value: string) => {
        const [hours, minutes] = value.split(':');

        setSelectedTimes((prev) => {
            return [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    hours: Number(hours),
                    minutes: Number(minutes),
                },
            ];
        });

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
                <TimePicker value="10:00" onSave={handleSave} />
            </Box>
        </Modal>
    );
};

const TimeItem: FC<{
    time: ScheduleTime;
    setSelectedTimes: Dispatch<SetStateAction<ScheduleTime[]>>;
}> = ({ time, setSelectedTimes }) => {
    const { id, hours, minutes } = time;

    const handleDeleteTime = (id: string) => {
        return () => {
            setSelectedTimes((prev) => {
                return prev.filter((time) => time.id !== id);
            });
        };
    };

    return (
        <Box sx={{ ...RowBoxStyles, justifyContent: 'space-between' }}>
            <Typography variant="body1">{formatTime(hours, minutes)}</Typography>
            <TextField
                type="number"
                sx={{ maxWidth: 70 }}
                slotProps={{
                    input: {
                        sx: {
                            height: 40,
                        },
                    },
                }}
            />
            <TextField
                fullWidth
                select
                slotProps={{
                    input: {
                        sx: {
                            height: 40,
                        },
                    },
                }}
            >
                {typedObjectKeys(MedUnit).map((unit) => {
                    return <MenuItem key={unit}>{unit}</MenuItem>;
                })}
            </TextField>
            <IconButton onClick={handleDeleteTime(id)} sx={{ color: PALETTE.ERROR }}>
                <DeleteOutlinedIcon />
            </IconButton>
        </Box>
    );
};
