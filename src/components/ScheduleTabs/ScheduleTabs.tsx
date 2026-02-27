'use client';

import { typedObjectKeys } from '@/utils/typedObjectKeys';
import { Box, Typography } from '@mui/material';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { classNames } from '@/utils/classNames';
import classes from '@/styles/tabs.module.scss';
import { Med, ScheduleItem } from '@/types';
import { DayScroller } from './DayScroller';
import moment from 'moment';
import { DashboardItemType, getEventsForSelectedDate } from '@/utils/getEventsForSelectedDate';
import { ScheduleList } from './ScheduleList';
import { DATE_FORMAT } from '@/utils/consts';

interface IScheduleTabsProps {
    schedule: Array<ScheduleItem>;
    meds: Array<Med>;
}

export enum SCHEDULE_TABS {
    DAY = 'day',
    WEEK = 'week',
}

export type DayMedsSchedule = ReturnType<typeof sortByTimeOfDay>;

export const ScheduleTabs: FC<IScheduleTabsProps> = memo(({ schedule, meds }) => {
    const [selectedTab, setSelectedTab] = useState<SCHEDULE_TABS>(SCHEDULE_TABS.DAY);
    const [selectedDate, setSelectedDate] = useState<string>(moment().format(DATE_FORMAT));

    const tabChange = (tab: SCHEDULE_TABS) => {
        setSelectedTab(tab);
    };

    useEffect(() => {
        setSelectedDate(
            (selectedTab === SCHEDULE_TABS.WEEK ? moment().startOf('isoWeek') : moment()).format(
                DATE_FORMAT
            )
        );
    }, [selectedTab]);

    const changeDate = useCallback((val: string) => {
        setSelectedDate(val);
    }, []);

    const preparedSchedule = useMemo((): Array<ReturnType<typeof sortByTimeOfDay>> => {
        if (selectedTab === SCHEDULE_TABS.WEEK) {
            return [...new Array(7)]
                .map((_, index) => {
                    return moment(selectedDate, DATE_FORMAT, true)
                        .startOf('day')
                        .add(index, 'days')
                        .format(DATE_FORMAT);
                })
                .map((date) => {
                    const events = getEventsForSelectedDate(schedule, date);

                    if (!events.length) {
                        return false;
                    }

                    return sortByTimeOfDay(
                        addMedsToSchedule(getEventsForSelectedDate(schedule, date), meds),
                        date
                    );
                })
                .filter(Boolean) as Array<ReturnType<typeof sortByTimeOfDay>>;
        }

        return [
            sortByTimeOfDay(
                addMedsToSchedule(getEventsForSelectedDate(schedule, selectedDate), meds),
                selectedDate
            ),
        ];
    }, [meds, schedule, selectedDate, selectedTab]);

    return (
        <Box>
            <Box py={3}>
                <Box className={classes.tabContainer}>
                    {typedObjectKeys(SCHEDULE_TABS).map((tab) => {
                        const isActive = selectedTab === SCHEDULE_TABS[tab];

                        const onChange = () => {
                            tabChange(SCHEDULE_TABS[tab]);
                        };

                        return (
                            <Box
                                key={tab}
                                onClick={onChange}
                                className={classNames(classes.tab, isActive && classes.activeTab)}
                            >
                                <Typography color={isActive ? 'primary' : 'textPrimary'}>
                                    {SCHEDULE_TABS[tab]}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
            <DayScroller
                type={selectedTab === SCHEDULE_TABS.WEEK ? 'weeks' : 'days'}
                changeDate={changeDate}
                selectedDate={selectedDate}
            />
            <ScheduleList schedule={preparedSchedule} />
        </Box>
    );
});

const addMedsToSchedule = (schedule: DashboardItemType[], meds: Med[]) => {
    const findMedById = (id: string) => {
        return meds.find((med) => med.id === id);
    };

    return schedule.map((schedule) => {
        return {
            ...schedule,
            med: findMedById(schedule.medId),
        };
    });
};

const sortByTimeOfDay = (schedule: ReturnType<typeof addMedsToSchedule>, date: string) => {
    return {
        id: crypto.randomUUID(),
        date: date,
        morning: schedule.filter(({ hours }) => hours < 12),
        afternoon: schedule.filter(({ hours }) => hours < 18 && hours > 12),
        evening: schedule.filter(({ hours }) => hours > 18),
    };
};
