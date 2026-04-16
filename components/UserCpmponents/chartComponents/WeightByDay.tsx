import React from 'react';
import BaseChart, { createTooltipFormatter } from './BaseChart';
import { ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';
import { LabelList } from 'recharts';
import { ExerciseOptionSession, ExerciseSession, ExercisesessionData } from '@/utils/util';

const WeightByDay = ({ data }: { data: any }) => {
    const totalWeightByDay: Record<string, unknown>[] = Object.values(
        data?.sessions
            .flatMap((session: ExerciseSession) => {
                if (!session.createdAt) return [];
                const day = new Date(session.createdAt).toLocaleString('ko-KR', { weekday: 'long' });
                return {
                    day,
                    totalWeight: session.exercises
                        .map((exercise: ExerciseOptionSession) =>
                            exercise.session
                                .map((s: ExercisesessionData) => s.weight * s.reps)
                                .reduce((a, b) => a + b, 0)
                        )
                        .reduce((a, b) => a + b, 0),
                };
            })
            .reduce((acc: Record<string, { day: string; totalWeight: number }>, cur: any) => {
                if (acc[cur.day]) acc[cur.day].totalWeight += cur.totalWeight;
                else acc[cur.day] = cur;
                return acc;
            }, {})
    );

    /** 짝수 인덱스에만 레이블 표시 */
    const CustomEvenIndexLabel = (props: any) => {
        const { x, y, value, index } = props;
        if (index % 2 !== 0) return null;
        return (
            <text x={x} y={y - 12} textAnchor="middle" className="fill-foreground text-[12px]">
                {`${value} kg`}
            </text>
        );
    };

    return (
        <BaseChart data={totalWeightByDay} type="line" className="aspect-auto min-h-[200px] w-full">
            <BaseChart.Grid />
            <BaseChart.XAxis dataKey="day" tickFormatter={(v) => v.slice(0, 3)} tickMargin={8} />
            <BaseChart.Tooltip
                cursor={true}
                content={<ChartTooltipContent indicator="line" />}
                formatter={createTooltipFormatter({
                    titleKey: 'day',
                    labelName: '횟수 x 무게(kg)',
                    valueKey: 'totalWeight',
                    indicator: 'line',
                    valueSuffix: 'kg',
                })}
            />
            <BaseChart.Legend content={<ChartLegendContent />} />
            <BaseChart.Line
                dataKey="totalWeight"
                type="natural"
                stroke="var(--color-totalWeight)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-totalWeight)' }}
                activeDot={{ r: 6 }}
            >
                <LabelList content={<CustomEvenIndexLabel />} />
            </BaseChart.Line>
        </BaseChart>
    );
};

export default WeightByDay;