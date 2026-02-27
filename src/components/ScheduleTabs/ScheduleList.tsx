import { Med } from '@/types';
import { addTrailingZero } from '@/utils/addTrailingZero';
import { CheckBox } from '@mui/icons-material';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import { FC } from 'react';
import { DayMedsSchedule } from './ScheduleTabs';
import { useI18n } from '../I18nProvider';
import { DATE_FORMAT, DOT } from '@/utils/consts';
import moment from 'moment';

export interface IScheduleList {
    schedule: Array<DayMedsSchedule>;
}

const timeOfDay: Array<keyof DayMedsSchedule> = ['morning', 'afternoon', 'evening'];

const MED_CONTAINER_STYLES = {
    mb: 3,
    '& > div': {
        borderRadius: 0,
        borderBottom: '1px solid #eee',
        '&:first-child': {
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
        },
        '&:last-child': {
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
            border: 0,
        },
    },
};

const ONE_DAY_TITLE_STYLES = { textTransform: 'capitalize', fontWeight: 500, fontSize: '18px' };
const MULTIPLE_DAYS_TITLE_STYLES = {
    textTransform: 'uppercase',
    fontSize: '12px',
    letterSpacing: '0.5px',
    fontWeight: 600,
    color: '#9AA6A6',
};

export const ScheduleList: FC<IScheduleList> = ({ schedule }) => {
    const { t } = useI18n();
    const isOneDay = schedule.length === 1;

    return (
        <Box py={4}>
            {schedule.map((scheduleItem) => {
                const scheduleTitle = moment(scheduleItem.date, DATE_FORMAT, true).format(
                    `dddd ${DOT} DD MMMM`
                );

                return (
                    <Box key={scheduleItem.id}>
                        {!isOneDay && (
                            <Typography
                                fontWeight={500}
                                fontSize={18}
                                pl={0.5}
                                pb={2}
                                mb={2}
                                sx={{
                                    borderBottom: '1px solid #eee',
                                }}
                            >
                                {scheduleTitle}
                            </Typography>
                        )}
                        {timeOfDay.map((name, index) => {
                            const group = scheduleItem[name];

                            if (!Array.isArray(group) || !group.length) {
                                return null;
                            }

                            return (
                                <Box key={index}>
                                    <Typography
                                        variant="h3"
                                        mb={2}
                                        pl={0.5}
                                        sx={
                                            isOneDay
                                                ? ONE_DAY_TITLE_STYLES
                                                : MULTIPLE_DAYS_TITLE_STYLES
                                        }
                                    >
                                        {t(name)}
                                    </Typography>
                                    <Box sx={MED_CONTAINER_STYLES}>
                                        {group.map((item) => {
                                            return (
                                                <MedItem
                                                    key={`${item.id}-${item.hours}-${item.minutes}`}
                                                    med={item.med}
                                                    hours={item.hours}
                                                    minutes={item.minutes}
                                                />
                                            );
                                        })}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                );
            })}
        </Box>
    );
};

const MedItem = ({
    med,
    hours,
    minutes,
}: {
    med: Med | undefined;
    hours: number;
    minutes: number;
}) => {
    if (!med) {
        return null;
    }

    return (
        <Paper sx={{ display: 'flex', alignItems: 'center' }}>
            <Box p={4}>{`${addTrailingZero(hours)}:${addTrailingZero(minutes)}`}</Box>
            <Box sx={{ flex: '1' }}>
                <Typography>{med.name}</Typography>
                <Typography>{`${med.strength} ${med.unit}`}</Typography>
            </Box>
            <Box p={2}>
                <IconButton>
                    <CheckBox />
                </IconButton>
            </Box>
        </Paper>
    );
};
