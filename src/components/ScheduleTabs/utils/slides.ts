import { DATE_FORMAT } from '@/utils/consts';
import moment, { type Moment } from 'moment';

export interface IWeek {
    weekStart: string;
    weekEnd: string;
    id: string;
    momentObj: Moment;
    months: number;
}

export interface IDay {
    day: number;
    weekDay: string;
    date: string;
    id: string;
    momentObj: Moment;
    months: number;
}

type TimeType = 'weeks' | 'days';

export const SLIDE_COUNT = 31;

export function prepareDateObj(obj: Moment, type: 'weeks' | 'days'): IWeek | IDay {
    const baseFields = {
        id: obj.format(DATE_FORMAT),
        momentObj: obj,
        months: obj.month() + 1,
    };

    if (type == 'weeks') {
        return {
            ...baseFields,
            weekStart: obj.format('DD'),
            weekEnd: obj.clone().add(6, 'days').format('DD'),
        };
    }

    return {
        ...baseFields,
        day: obj.date(),
        weekDay: obj.format('ddd'),
        date: obj.format('DD'),
    };
}

export function createBaseSlides(type: TimeType) {
    let currentDay = moment();

    if (type === 'weeks') {
        currentDay = currentDay.startOf('isoWeek');
    }

    if (type === 'weeks') {
        const prev = createSlides(currentDay, 'backward', Math.floor(SLIDE_COUNT), 'weeks');
        const post = createSlides(currentDay, 'forward', Math.floor(SLIDE_COUNT / 2), 'weeks');
        return [...prev, prepareDateObj(currentDay, 'weeks'), ...post];
    }

    const prev = createSlides(currentDay, 'backward', Math.floor(SLIDE_COUNT), 'days');
    const post = createSlides(currentDay, 'forward', Math.floor(SLIDE_COUNT / 2), 'days');

    return [...prev, prepareDateObj(currentDay, 'days'), ...post];
}

export function createSlides(
    date: Moment | undefined,
    direction: 'forward' | 'backward',
    count: number,
    type: TimeType = 'days'
) {
    const method = direction === 'forward' ? 'add' : 'subtract';

    return [...new Array(count)].map((_, index) => {
        const numeral = direction === 'forward' ? index + 1 : count - index;

        const newDate = date?.clone()[method](numeral, type) ?? moment();

        if (type === 'weeks') {
            return prepareDateObj(newDate, 'weeks');
        }

        return prepareDateObj(newDate, 'days');
    });
}
