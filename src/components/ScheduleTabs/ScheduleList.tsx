import { type IntakeEvent, type Med } from '@/types';
import { addTrailingZero } from '@/utils/formatData';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import { type FC } from 'react';
import { type DayMedsSchedule } from './ScheduleTabs';
import { useI18n } from '../I18nProvider';
import { DATE_FORMAT, DOT } from '@/utils/consts';
import moment from 'moment';
import { PALETTE } from '@/utils/theme/colors';
import { EventStatus } from '../EventStatus/EventStatus';
import { useRouter } from 'next/navigation';

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
    color: PALETTE.BRAND_TEAL_DARK_PALE,
};

export const ScheduleList: FC<IScheduleList> = ({ schedule }) => {
    const { t } = useI18n();
    const isOneDay = schedule.length === 1;

    const startDate = moment().startOf('day');
    const tomorrow = moment().add(1, 'day').startOf('day');

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
                                            const momentDate = moment(
                                                scheduleItem.date,
                                                DATE_FORMAT,
                                                true
                                            );

                                            let status = item.event?.status;

                                            if (!status && momentDate.isBefore(startDate)) {
                                                status = 'missed';
                                            }

                                            return (
                                                <MedItem
                                                    key={`${item.id}-${item.hours}-${item.minutes}`}
                                                    med={item.med}
                                                    hours={item.hours}
                                                    minutes={item.minutes}
                                                    status={status}
                                                    canBeClicked={momentDate.isBefore(tomorrow)}
                                                    computedId={item.computedId}
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
    status,
    canBeClicked,
    computedId,
}: {
    med: Med | undefined;
    hours: number;
    minutes: number;
    status: IntakeEvent['status'] | undefined;
    canBeClicked: boolean;
    computedId?: string;
}) => {
    const router = useRouter();

    if (!med) {
        return null;
    }

    const goToItem = () => {
        if (!canBeClicked) {
            return;
        }

        router.push(`/dashboard/${computedId}`);
    };

    return (
        <Paper
            sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: canBeClicked ? 'pointer' : 'default',
            }}
            onClick={goToItem}
        >
            <Box p={4}>{`${addTrailingZero(hours)}:${addTrailingZero(minutes)}`}</Box>
            <Box sx={{ flex: '1' }}>
                <Typography>{med.name}</Typography>
                <Typography>{`${med.strength} ${med.unit}`}</Typography>
            </Box>
            <Box p={2}>
                <IconButton>
                    <EventStatus status={status} />
                </IconButton>
            </Box>
        </Paper>
    );
};
