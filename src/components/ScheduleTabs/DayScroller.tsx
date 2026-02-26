'use client';

import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaCarouselType, EmblaOptionsType, EngineType } from 'embla-carousel';
import moment from 'moment';
import { Box, debounce, Typography } from '@mui/material';
import { BRAND_TEAL } from '@/utils/theme/colors';
import { createBaseSlides, createSlides, IDay, IWeek, SLIDE_COUNT } from './utils/slides';
import { DATE_FORMAT } from '@/utils/consts';

interface IDayScrollerProps {
    type: 'days' | 'weeks';
    changeDate: (val: string) => void;
    selectedDate: string;
}

const OPTIONS: EmblaOptionsType | Record<string, string | boolean | number> = {
    dragFree: true,
    containScroll: 'keepSnaps',
    slideChanges: true,
    resize: false,
    startSnap: 0,
};

export const DayScroller: FC<IDayScrollerProps> = memo(({ type, selectedDate, changeDate }) => {
    const scrollListenerRef = useRef<() => void>(() => undefined);
    const listenForScrollRef = useRef(true);
    const hasMoreToLoadRef = useRef(true);
    const [slides, setSlides] = useState(createBaseSlides(type));
    const [prefLoading, setPrefLoading] = useState(true);
    const isLoadingRef = useRef(false);
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);

    const goToTodaySlide = useCallback(() => {
        if (!emblaApi) {
            return;
        }

        emblaApi.goTo(SLIDE_COUNT, true);

        setPrefLoading(false);
    }, [emblaApi]);

    useEffect(() => {
        setSlides(createBaseSlides(type));
        goToTodaySlide();
    }, [goToTodaySlide, type]);

    useEffect(() => {
        goToTodaySlide();
    }, [goToTodaySlide]);

    const onSlideChanges = useCallback((emblaApi: EmblaCarouselType) => {
        const reloadEmbla = (): void => {
            const oldEngine = emblaApi.internalEngine();

            emblaApi.reInit();
            const newEngine = emblaApi.internalEngine();
            const copyEngineModules: (keyof EngineType)[] = [
                'scrollBody',
                'location',
                'offsetLocation',
                'previousLocation',
                'target',
            ];

            copyEngineModules.forEach((engineModule) => {
                Object.assign(newEngine[engineModule], oldEngine[engineModule]);
            });

            newEngine.translate.to(oldEngine.location);
            const { index } = newEngine.scrollTarget.byDistance(0, false);
            newEngine.indexCurrent.set(index);
            newEngine.animation.start();

            listenForScrollRef.current = true;
        };

        const reloadAfterPointerUp = (): void => {
            emblaApi.off('pointerup', reloadAfterPointerUp);
            reloadEmbla();
        };

        const engine = emblaApi.internalEngine();

        if (hasMoreToLoadRef.current && engine.dragHandler.pointerDown()) {
            const boundsActive = engine.limit.pastMaxBound(engine.target);
            engine.scrollBounds.toggleActive(boundsActive);
            emblaApi.on('pointerup', reloadAfterPointerUp);
        } else {
            reloadEmbla();
        }

        return false;
    }, []);

    const EDGE = 2;
    const CHUNK = 5;

    const lastTriggeredSnapRef = useRef<number | null>(null);

    const onScroll = useCallback(() => {
        if (!emblaApi) return;
        if (isLoadingRef.current) return;

        const snap = emblaApi.selectedSnap();
        const lastSnap = emblaApi.snapList().length - 1;

        const nearStart = snap <= EDGE;
        const nearEnd = snap >= lastSnap - EDGE;

        if (!nearStart && !nearEnd) {
            lastTriggeredSnapRef.current = null;
            return;
        }

        if (lastTriggeredSnapRef.current === snap) return;
        lastTriggeredSnapRef.current = snap;

        isLoadingRef.current = true;

        const method = nearEnd ? 'forward' : 'backward';

        setSlides((prevSlides) => {
            const anchor = prevSlides.at(method === 'backward' ? 0 : -1);
            const newSlides = createSlides(anchor?.momentObj, method, CHUNK, type);

            return method === 'backward'
                ? [...newSlides, ...prevSlides]
                : [...prevSlides, ...newSlides];
        });

        if (method === 'backward') {
            // компенсируем prepend, чтобы не залипать у начала
            emblaApi.goTo(snap + CHUNK - 2, true);
        }

        isLoadingRef.current = false;
    }, [emblaApi, type]);

    const addScrollListener = useCallback(
        (emblaApi: EmblaCarouselType) => {
            console.log('type inside AddScroll', type);

            emblaApi.off('scroll', scrollListenerRef.current);
            scrollListenerRef.current = onScroll;
            emblaApi.on('scroll', scrollListenerRef.current);
        },
        [onScroll, type]
    );

    useEffect(() => {
        if (!emblaApi) return;
        addScrollListener(emblaApi);

        const onResize = () => emblaApi.reInit();
        window.addEventListener('resize', onResize);
        emblaApi.on('destroy', () => window.removeEventListener('resize', onResize));
        emblaApi.on('slideschanged', onSlideChanges);
    }, [emblaApi, addScrollListener, onSlideChanges, type]);

    const todayObj = (type === 'weeks' ? moment().startOf('isoWeek') : moment()).format(
        DATE_FORMAT
    );

    return (
        <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div
                    className="embla__container"
                    style={{ opacity: prefLoading ? 0 : 1, transition: 'opacity .4s ease-in-out' }}
                >
                    {slides.map((date) => {
                        const isToday = date.id === todayObj;
                        const isActive = selectedDate === date.id;
                        const isAWeekDay = isItWeekDate(date);

                        const onClick = () => changeDate(date.id);

                        return (
                            <div className="embla__slide" key={date.id}>
                                <Box
                                    sx={{
                                        background: isActive ? BRAND_TEAL : 'transparent',
                                        border: `1px solid ${isToday ? BRAND_TEAL : 'transparent'}`,
                                        height: 'var(--slide-height)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        transition: 'all .2s ease-in-out',
                                        color: isActive ? '#FFF' : 'inherit',
                                        borderRadius: '20px',
                                    }}
                                    onClick={onClick}
                                >
                                    <Typography
                                        sx={{
                                            color: isActive
                                                ? 'rgba(255, 255, 255, 0.8)'
                                                : 'inherit',
                                        }}
                                    >
                                        {isAWeekDay ? date.weekStart : date.weekDay}
                                    </Typography>
                                    {isAWeekDay && (
                                        <Typography sx={{ lineHeight: '0.6' }}>-</Typography>
                                    )}
                                    <Typography>{isAWeekDay ? date.weekEnd : date.date}</Typography>
                                </Box>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

const isItWeekDate = (date: IWeek | IDay): date is IWeek => {
    return Object.prototype.hasOwnProperty.call(date, 'weekStart');
};
