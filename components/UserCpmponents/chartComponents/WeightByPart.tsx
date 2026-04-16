import React from 'react';
import BaseChart, { createTooltipFormatter } from './BaseChart';
import { ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';

const TAG_FILTER = ['가슴', '어깨', '등', '하체'] as const;

const WeightByPart = ({ data }: { data: any }) => {
    const result = TAG_FILTER.reduce<Record<string, number>>((acc, tag) => {
        acc[tag] = 0;
        return acc;
    }, {});

    data?.sessions
        .flatMap((session: any) =>
            session.exercises.map((exercise: any) => ({
                totalWeight: exercise.session.reduce((sum: number, s: any) => sum + s.reps * s.weight, 0),
                tags: exercise.exerciseId.tags.filter((t: string) => TAG_FILTER.includes(t as any)),
            }))
        )
        .forEach((item: any) => {
            item.tags.forEach((tag: string) => {
                result[tag] += item.totalWeight;
            });
        });

    const chartData = Object.entries(result).map(([part, weight]) => ({ part, weight }));

    return (
        <BaseChart data={chartData} type="bar">
            <BaseChart.Grid />
            <BaseChart.XAxis dataKey="part" tickFormatter={(v) => v.slice(0, 3)} />
            <BaseChart.Tooltip
                cursor={true}
                content={<ChartTooltipContent />}
                formatter={createTooltipFormatter({
                    titleKey: 'part',
                    labelName: '총 무게(kg)',
                    valueKey: 'weight',
                    valueSuffix: 'kg',
                })}
            />
            <BaseChart.Legend content={<ChartLegendContent />} />
            <BaseChart.Bar dataKey="weight" fill="var(--color-weight)" radius={4} />
        </BaseChart>
    );
};

export default WeightByPart;