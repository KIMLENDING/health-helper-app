'use client';

import React from 'react';
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    LabelList,
} from 'recharts';
import { chartConfig as defaultChartConfig } from '@/lib/utils';

// ─── 타입 ──────────────────────────────────────────────────────────────────────
interface BaseChartProps {
    /** recharts에 넘길 데이터 배열 */
    data: Record<string, unknown>[];
    /** ChartContainer에 사용할 config (미지정 시 lib/utils의 기본값 사용) */
    config?: ChartConfig;
    /** 차트 타입 (기본값: 'bar') */
    type?: 'bar' | 'line';
    className?: string;
    children: React.ReactNode;
}

interface GridProps {
    strokeDasharray?: string;
    stroke?: string;
}

interface AxisProps {
    dataKey: string;
    tickFormatter?: (value: string) => string;
    tickMargin?: number;
}

// ─── 래퍼 가능한 서브컴포넌트 ─────────────────────────────────────────────────
// CartesianGrid / XAxis 는 recharts가 일반 React 컴포넌트로 렌더링하므로 래퍼 OK

/** CartesianGrid 래퍼 — 기본값(strokeDasharray, stroke) 제공 */
const Grid = ({
    strokeDasharray = '3 3',
    stroke = '#616266',
}: GridProps) => (
    <CartesianGrid strokeDasharray={strokeDasharray} stroke={stroke} vertical={false} />
);

/** XAxis 래퍼 — tickLine·axisLine 기본 off, 앞 5글자로 tickFormatter 기본 제공 */
const XAxisWrapper = ({ dataKey, tickFormatter, tickMargin = 10 }: AxisProps) => (
    <XAxis
        dataKey={dataKey}
        tickLine={false}
        axisLine={false}
        tickMargin={tickMargin}
        tickFormatter={tickFormatter ?? ((v) => v.slice(0, 5))}
    />
);

// ─── 유틸리티 ──────────────────────────────────────────────────────────────────
/**
 * 통일된 디자인의 커스텀 툴팁을 생성하는 팩토리 함수
 */
export const createTooltipFormatter = ({
    titleKey,
    labelName,
    valueKey,
    indicator = 'dot',
    valueSuffix = '',
}: {
    titleKey: string;
    labelName: string;
    valueKey: string;
    indicator?: 'dot' | 'line';
    valueSuffix?: string;
}) => {
    const TooltipContent = (value: any, name: any, item: any) => {
        return (
            <div className="grid gap-1.5 w-full min-w-[150px]">
                <div className="font-semibold text-foreground mb-0.5">
                    {item.payload[titleKey]}
                </div>
                <div className="flex w-full items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div
                            className={indicator === 'line' ? "shrink-0 w-1 h-3 rounded-[2px]" : "h-2.5 w-2.5 shrink-0 rounded-[2px]"}
                            style={{ backgroundColor: item.color || item.payload.fill || `var(--color-${name})` }}
                        />
                        <span className="text-muted-foreground text-xs">{labelName}</span>
                    </div>
                    <span className="font-mono font-medium tabular-nums text-foreground">
                        {typeof item.payload[valueKey] === 'number'
                            ? item.payload[valueKey].toLocaleString()
                            : item.payload[valueKey]}
                        {valueSuffix ? ` ${valueSuffix}` : ''}
                    </span>
                </div>
            </div>
        );
    };
    TooltipContent.displayName = "TooltipContent";

    return TooltipContent;
}

// ─── BaseChart 루트 ────────────────────────────────────────────────────────────
/**
 * Compound Component 패턴의 범용 차트 래퍼.
 *
 * ⚠️ recharts 동작 방식 주의:
 *   - Bar / Line / Tooltip(ChartTooltip) / Legend(ChartLegend) 는 recharts가
 *     child.type.displayName 으로 식별한 뒤 props를 직접 읽어 렌더링합니다.
 *   - 따라서 래퍼 컴포넌트로 감싸면 인식 불가 → 차트 미표시 / 툴팁 미작동.
 *   - 이 컴포넌트들은 recharts/shadcn 원본을 BaseChart.XXX 로 직접 노출합니다.
 *   - CartesianGrid / XAxis 만 래퍼 OK (recharts가 일반 React 컴포넌트로 렌더링).
 *
 * @example Bar 차트
 * <BaseChart data={data} type="bar">
 *   <BaseChart.Grid />
 *   <BaseChart.XAxis dataKey="day" />
 *   <BaseChart.Tooltip cursor={true} content={<ChartTooltipContent />} />
 *   <BaseChart.Legend content={<ChartLegendContent />} />
 *   <BaseChart.Bar dataKey="totalTime" fill="var(--color-totalTime)" radius={4} />
 * </BaseChart>
 */
const BaseChart = ({
    data,
    config,
    type = 'bar',
    className = 'min-h-[200px] aspect-auto w-full',
    children,
}: BaseChartProps) => {
    const ChartRoot = type === 'bar' ? BarChart : LineChart;
    const margin = type === 'bar' ? { top: 10, left: 12, right: 12 } : { top: 30, left: 12, right: 12 };
    return (
        <ChartContainer config={config ?? defaultChartConfig} className={className}>
            <ChartRoot
                accessibilityLayer
                data={data}
                margin={margin}
            >
                {children}
            </ChartRoot>
        </ChartContainer>
    );
};

// ─── 서브컴포넌트 연결 ─────────────────────────────────────────────────────────
BaseChart.Grid = Grid;           // 래퍼 OK
BaseChart.XAxis = XAxisWrapper;   // 래퍼 OK
BaseChart.Tooltip = ChartTooltip;   // shadcn 원본 직접 연결 (recharts displayName 인식)
BaseChart.Legend = ChartLegend;    // shadcn 원본 직접 연결
BaseChart.Bar = Bar;            // recharts 원본 직접 연결
BaseChart.Line = Line;           // recharts 원본 직접 연결
BaseChart.LabelList = LabelList;
BaseChart.TooltipContent = ChartTooltipContent;   // content prop에 쓸 때 편하게 노출
BaseChart.LegendContent = ChartLegendContent;

export default BaseChart;
