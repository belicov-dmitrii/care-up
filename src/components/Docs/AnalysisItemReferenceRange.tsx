'use client';

import { Box, Typography, useTheme } from '@mui/material';
import { ChartsDataProvider, ChartsSurface, ChartsXAxis, ChartsReferenceLine } from '@mui/x-charts';
import { useDrawingArea, useXScale } from '@mui/x-charts/hooks';

type RangeValue = {
    amount: number;
    unit: string;
};

type ReferenceRange = {
    min: number;
    max: number;
    unit: string;
};

type AnalysisRangeChartProps = {
    title?: string;
    value: RangeValue;
    referenceRange: ReferenceRange;
    height?: number;
};

function BaseLine({ y }: { y: number }) {
    const { left, width } = useDrawingArea();
    const theme = useTheme();

    return (
        <line
            x1={left}
            x2={left + width}
            y1={y}
            y2={y}
            stroke={theme.palette.divider}
            strokeWidth={8}
            strokeLinecap="round"
        />
    );
}

function RangeBand({ min, max, y }: { min: number; max: number; y: number }) {
    const xScale = useXScale();
    const theme = useTheme();

    if (!xScale) return null;

    const x1 = xScale(min);
    const x2 = xScale(max);

    if (x1 == null || x2 == null) return null;

    return (
        <line
            x1={x1}
            x2={x2}
            y1={y}
            y2={y}
            stroke={theme.palette.success.main}
            strokeWidth={10}
            strokeLinecap="round"
        />
    );
}

function ValueDot({ value, y, inRange }: { value: number; y: number; inRange: boolean }) {
    const xScale = useXScale();
    const theme = useTheme();

    if (!xScale) return null;

    const cx = xScale(value);
    if (cx == null) return null;

    const color = inRange ? theme.palette.success.main : theme.palette.error.main;

    return (
        <>
            <circle
                cx={cx}
                cy={y}
                r={10}
                fill={color}
                stroke={theme.palette.background.paper}
                strokeWidth={4}
            />
            <circle
                cx={cx}
                cy={y}
                r={17}
                fill="transparent"
                stroke={color}
                strokeOpacity={0.18}
                strokeWidth={8}
            />
        </>
    );
}

function ValueLabel({ value, unit, y }: { value: number; unit: string; y: number }) {
    const xScale = useXScale();
    const theme = useTheme();

    if (!xScale) return null;

    const x = xScale(value);
    if (x == null) return null;

    return (
        <text
            x={x}
            y={y}
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill={theme.palette.text.primary}
        >
            {value} {unit}
        </text>
    );
}

function IndicatorLayer({
    value,
    referenceRange,
    lineY,
}: {
    value: RangeValue;
    referenceRange: ReferenceRange;
    lineY: number;
}) {
    const inRange = value.amount >= referenceRange.min && value.amount <= referenceRange.max;

    return (
        <>
            <BaseLine y={lineY} />
            <RangeBand min={referenceRange.min} max={referenceRange.max} y={lineY} />
            <ValueDot value={value.amount} y={lineY} inRange={inRange} />
            <ValueLabel value={value.amount} unit={value.unit} y={lineY - 18} />
        </>
    );
}

function RangeLabels({ min, max, y }: { min: number; max: number; y: number }) {
    const xScale = useXScale();
    const theme = useTheme();

    if (!xScale) return null;

    const xMin = xScale(min);
    const xMax = xScale(max);

    if (xMin == null || xMax == null) return null;

    return (
        <>
            <text
                x={xMin + 15}
                y={y}
                textAnchor="middle"
                fontSize="12"
                fill={theme.palette.text.secondary}
            >
                {min}
            </text>

            <text
                x={xMax + 15}
                y={y}
                textAnchor="middle"
                fontSize="12"
                fill={theme.palette.text.secondary}
            >
                {max}
            </text>
        </>
    );
}

export default function AnalysisRangeChart({
    title = 'Hemoglobin',
    value,
    referenceRange,
    height = 120,
}: AnalysisRangeChartProps) {
    const theme = useTheme();

    const inRange = value.amount >= referenceRange.min && value.amount <= referenceRange.max;

    const rangeSize = Math.max(referenceRange.max - referenceRange.min, 1);
    const padding = Math.max(rangeSize * 0.35, 10);

    const domainMin = Math.min(referenceRange.min, value.amount) - padding;
    const domainMax = Math.max(referenceRange.max, value.amount) + padding;

    const lineY = 42;

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: 2,
                    mb: 1.5,
                }}
            >
                <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Reference range: {referenceRange.min}–{referenceRange.max}{' '}
                        {referenceRange.unit}
                    </Typography>
                </Box>

                <Typography
                    variant="h6"
                    fontWeight={800}
                    color={inRange ? 'success.main' : 'error.main'}
                    sx={{ whiteSpace: 'nowrap' }}
                >
                    {value.amount} {value.unit}
                </Typography>
            </Box>
            <ChartsDataProvider
                height={height}
                margin={{ top: 26, right: 20, bottom: 34, left: 20 }}
                series={[]}
                xAxis={[
                    {
                        id: 'x',
                        scaleType: 'linear',
                        min: domainMin,
                        max: domainMax,
                        position: 'bottom',
                        tickNumber: 3,
                    },
                ]}
                yAxis={[
                    {
                        id: 'hidden-y',
                        min: 0,
                        max: 1,
                        position: 'none',
                    },
                ]}
            >
                <ChartsSurface>
                    <IndicatorLayer value={value} referenceRange={referenceRange} lineY={lineY} />

                    <ChartsReferenceLine
                        axisId="x"
                        x={referenceRange.min}
                        lineStyle={{
                            stroke: theme.palette.text.disabled,
                            strokeDasharray: '4 4',
                        }}
                    />

                    <ChartsReferenceLine
                        axisId="x"
                        x={referenceRange.max}
                        lineStyle={{
                            stroke: theme.palette.text.disabled,
                            strokeDasharray: '4 4',
                        }}
                    />

                    <ChartsXAxis axisId="range" />
                    <RangeLabels min={referenceRange.min} max={referenceRange.max} y={lineY + 28} />
                </ChartsSurface>
            </ChartsDataProvider>
        </Box>
    );
}
