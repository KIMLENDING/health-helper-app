import React, { useMemo } from 'react';
import BaseChart, { createTooltipFormatter } from './BaseChart';
import { ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';
import { ExerciseSession } from '@/utils/util';

type DaySummary = {
    day: string;
    totalTime: number;
    formetTime: string;
};

const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}분 ${secs}초`;
};

const TimeByDay = ({ data }: { data: any }) => {
    const totalTimeByDay = useMemo((): DaySummary[] => {
        if (!data) return [];
        return data.sessions.reduce((acc: DaySummary[], session: ExerciseSession) => {
            const totalTime = session.exercises.reduce((sum, ex) => sum + (ex.repTime || 0), 0);
            const day = new Date(session.createdAt!).toLocaleString('ko-KR', { weekday: 'long' });
            const existing = acc.find((item) => item.day === day);
            if (existing) {
                existing.totalTime += totalTime;
                existing.formetTime = formatTime(existing.totalTime);
            } else {
                acc.push({ day, totalTime, formetTime: formatTime(totalTime) });
            }
            return acc;
        }, []);
    }, [data]);

    return (
        <BaseChart data={totalTimeByDay} type="bar">
            <BaseChart.Grid />
            <BaseChart.XAxis dataKey="day" />
            <BaseChart.Tooltip
                cursor={true}
                content={<ChartTooltipContent />}
                formatter={createTooltipFormatter({
                    titleKey: 'day',
                    labelName: '운동시간(s)',
                    valueKey: 'formetTime',
                })}
            />
            <BaseChart.Legend content={<ChartLegendContent />} />
            <BaseChart.Bar dataKey="totalTime" fill="var(--color-totalTime)" radius={4} />
        </BaseChart>
    );
};

export default TimeByDay;
