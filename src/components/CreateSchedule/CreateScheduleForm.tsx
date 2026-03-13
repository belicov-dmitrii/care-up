'use client';

import { type CreateScheduleBody, ScheduleType, type Med } from '@/types';
import { ColumnBoxStyles, PaperStyles, RowBoxStyles, YEAR_FIRST_DATE_FORMAT } from '@/utils/consts';
import {
    alpha,
    Box,
    Button,
    Container,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { memo, useState, type FC, useReducer } from 'react';
import { useI18n } from '../I18nProvider';
import { getMedUnitDetails } from '@/utils/getMedExtendedDetails';
import MedicationIcon from '@mui/icons-material/Medication';
import { PALETTE } from '@/utils/theme/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment';
import { TimeItem } from './TimeItem';
import { AddTimeModal } from './AddTimeModal';
import { CreateScheduleActionTypes, createScheduleReducer } from './reducer';
import { isValidCreateScheduleBody } from '@/utils/typeGuards';
import { NetworkRequest } from '@/utils/NetworkRequest';

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
    const [state, dispatch] = useReducer(createScheduleReducer, {
        medId: id || meds[0].id,
        type: FREQUENCY_OPTIONS[0],
        time: [],
        dose: {},
        endDate: moment().format(YEAR_FIRST_DATE_FORMAT),
    });
    const [addTimeOpen, setAddTimeOpen] = useState<boolean>(false);
    const { t } = useI18n();

    const handleCreateSchedule = async () => {
        const doseCopy: CreateScheduleBody['dose'] = {};

        for (const id in state.dose) {
            doseCopy[id] = Number(state.dose[id]);
        }

        const { ok } = await NetworkRequest(
            '/create-schedule',
            { ...state, dose: doseCopy },
            { method: 'POST' }
        );

        if (!ok) return;
    };

    return (
        <Container sx={{ ...ColumnBoxStyles, padding: 0 }}>
            <Paper sx={PaperStyles}>
                <Typography variant="h3" fontSize={16}>
                    {t('Medication')}
                </Typography>
                <Select
                    value={state.medId}
                    variant="standard"
                    disableUnderline
                    onChange={(e) =>
                        dispatch({
                            type: CreateScheduleActionTypes.UpdateMedId,
                            payload: e.target.value,
                        })
                    }
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
                        const isActive = state.type === option;
                        const color = isActive
                            ? PALETTE.BRAND_TEAL
                            : alpha(PALETTE.BRAND_GREY, 0.6);
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
                                    textTransform: 'capitalize',
                                }}
                                onClick={() =>
                                    dispatch({
                                        type: CreateScheduleActionTypes.UpdateFrequency,
                                        payload: option,
                                    })
                                }
                            >
                                {option}
                            </Button>
                        );
                    })}
                </Box>
            </Paper>
            <Paper sx={PaperStyles}>
                <Typography variant="h3" fontSize={16}>
                    {t('End Date')}
                </Typography>
                <TextField
                    type="date"
                    value={moment(state.endDate).format(YEAR_FIRST_DATE_FORMAT)}
                    onChange={(e) =>
                        dispatch({
                            type: CreateScheduleActionTypes.UpdateEndDate,
                            payload: moment(e.target.value).format(YEAR_FIRST_DATE_FORMAT),
                        })
                    }
                    slotProps={{
                        htmlInput: {
                            min: moment().format(YEAR_FIRST_DATE_FORMAT),
                        },
                    }}
                />
            </Paper>
            <Paper sx={PaperStyles}>
                <Typography variant="h3" fontSize={16}>
                    {t('Daily Intake Times')}
                </Typography>
                {state.time.map((time) => {
                    return (
                        <TimeItem
                            key={time.id}
                            time={{ ...time, dose: state.dose[time.id] }}
                            dispatch={dispatch}
                        />
                    );
                })}
                <Button
                    variant="outlined"
                    sx={{
                        color: PALETTE.BRAND_TEAL,
                        border: `1px dashed ${PALETTE.BRAND_TEAL}`,
                        backgroundColor: alpha(PALETTE.BRAND_TEAL, 0.1),
                    }}
                    onClick={() => setAddTimeOpen(true)}
                >
                    <AddIcon />
                    {t('Add Time')}
                </Button>
            </Paper>
            <Button
                variant="contained"
                size="large"
                disabled={!isValidCreateScheduleBody(state)}
                onClick={handleCreateSchedule}
            >
                {t('Create Schedule')}
            </Button>
            <AddTimeModal open={addTimeOpen} setOpen={setAddTimeOpen} dispatch={dispatch} />
        </Container>
    );
});
