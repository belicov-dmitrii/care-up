'use client';

import { typedObjectKeys } from '@/utils/typedObjectKeys';
import { Box, Typography } from '@mui/material';
import { type FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { classNames } from '@/utils/classNames';
import classes from '@/styles/tabs.module.scss';
import { type IntakeEvent, type Med, type ScheduleItem } from '@/types';
import { DayScroller } from './DayScroller';
import moment from 'moment';
import { ScheduleList } from './ScheduleList';
import { DATE_FORMAT } from '@/utils/consts';
import { getEventsForSelectedDate } from '@/utils/getEventsForSelectedDate';
import { sortByTimeOfDay, addMedsToSchedule } from '@/utils/sortAndFilterMeds';
import { NetworkRequest } from '@/utils/NetworkRequest';

interface IScheduleTabsProps {
    schedule: Array<ScheduleItem>;
    meds: Array<Med>;
    events: Record<string, IntakeEvent>;
}

export enum SCHEDULE_TABS {
    DAY = 'day',
    WEEK = 'week',
}

export type DayMedsSchedule = ReturnType<typeof sortByTimeOfDay>;

export const ScheduleTabs: FC<IScheduleTabsProps> = memo(({ schedule, meds, events }) => {
    const [selectedTab, setSelectedTab] = useState<SCHEDULE_TABS>(SCHEDULE_TABS.DAY);
    const [selectedDate, setSelectedDate] = useState<string>(moment().format(DATE_FORMAT));
    const [clientEvents, setClientEvents] = useState<Record<string, IntakeEvent> | null>(null);
    console.log('🚀 ~ clientEvents:', clientEvents);

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

    useEffect(() => {
        (async () => {
            const { data, ok } = await NetworkRequest<Record<string, IntakeEvent>>(
                '/get-events',
                {
                    startDate: selectedDate,
                    endDate:
                        selectedTab === SCHEDULE_TABS.WEEK
                            ? moment(selectedDate, DATE_FORMAT, true)
                                  .endOf('isoWeek')
                                  .format(DATE_FORMAT)
                            : selectedDate,
                },
                { method: 'POST' }
            );

            if (!ok || !Object.keys(data).length) {
                return;
            }

            setClientEvents(data);
        })();
    }, [selectedDate, selectedTab]);

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
                    const weekEvents = getEventsForSelectedDate(
                        schedule,
                        date,
                        clientEvents || events
                    );

                    if (!weekEvents.length) {
                        return false;
                    }

                    return sortByTimeOfDay(addMedsToSchedule(weekEvents, meds), date);
                })
                .filter(Boolean) as Array<ReturnType<typeof sortByTimeOfDay>>;
        }

        return [
            sortByTimeOfDay(
                addMedsToSchedule(
                    getEventsForSelectedDate(schedule, selectedDate, clientEvents || events),
                    meds
                ),
                selectedDate
            ),
        ];
    }, [clientEvents, events, meds, schedule, selectedDate, selectedTab]);

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
