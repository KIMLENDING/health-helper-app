import React from 'react';
import BaseChart, { createTooltipFormatter } from './BaseChart';
import { ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';
import { ExerciseOptionSession, ExerciseSession, ExercisesessionData } from '@/utils/util';

const TitlebyDay = ({ data }: { data: any }) => {
    const totalWeightsByTitle = data?.sessions
        .flatMap((session: ExerciseSession) =>
            session.exercises.map((exercise: ExerciseOptionSession) => ({
                title: exercise.exerciseId.title,
                titleWeight: exercise.session
                    .map((s: ExercisesessionData) => s.weight * s.reps)
                    .reduce((a, b) => a + b, 0),
            }))
        )
        .reduce((acc: any[], cur: any) => {
            const existing = acc.find((item: any) => item.title === cur.title);
            if (existing) existing.titleWeight += cur.titleWeight;
            else acc.push(cur);
            return acc;
        }, [])
        .sort((a: any, b: any) => b.titleWeight - a.titleWeight)
        .slice(0, 5);

    return (
        <BaseChart data={totalWeightsByTitle ?? []} type="bar">
            <BaseChart.Grid />
            <BaseChart.XAxis dataKey="title" />
            <BaseChart.Tooltip
                cursor={true}
                content={<ChartTooltipContent />}
                formatter={createTooltipFormatter({
                    titleKey: 'title',
                    labelName: '총 무게(kg)',
                    valueKey: 'titleWeight',
                    valueSuffix: 'kg',
                })}
            />
            <BaseChart.Legend content={<ChartLegendContent />} />
            <BaseChart.Bar dataKey="titleWeight" fill="var(--color-titleWeight)" radius={4} />
        </BaseChart>
    );
};

export default TitlebyDay;