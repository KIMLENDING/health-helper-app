import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useSidebar } from '@/components/ui/sidebar';
import { chartConfig } from '@/lib/utils';
import { ExerciseSession } from '@/utils/util';
import React, { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const TimeByDay = ({ data }: { data: any }) => {
    type DaySummary = {
        day: string;
        totalTime: number;
        formetTime: string;
    };
    const { isMobile } = useSidebar();
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}분 ${secs}초`;
    };

    const totalTimeByDay = useMemo(() => {
        if (!data) return [];

        return data.sessions.reduce((acc: DaySummary[], session: ExerciseSession) => {
            const totalTime = session.exercises.reduce((sum, exercise) => {
                return sum + (exercise.repTime || 0);
            }, 0);

            const day = new Date(session.createdAt!).toLocaleString("ko-KR", {
                weekday: "long",
            });

            const existing = acc.find((item) => item.day === day);
            if (existing) {
                existing.totalTime += totalTime;
                existing.formetTime = formatTime(existing.totalTime);
            } else {
                acc.push({
                    day,
                    totalTime,
                    formetTime: formatTime(totalTime),
                });
            }

            return acc;
        }, []);
    }, [data]);

    return (
        <ChartContainer config={chartConfig} className={`min-h-[200px] aspect-auto w-full`}>
            <BarChart accessibilityLayer data={totalTimeByDay}
                margin={{ top: 20, left: 12, right: 12 }}
            // barSize={isMobile ? 20 : 50}
            >

                <ChartTooltip content={<ChartTooltipContent />}
                    formatter={(value, name, props) => {
                        return [<div
                            key="totalTime"
                            className='flex flex-row gap-1 items-center'>
                            <div className='h-2.5 w-2.5 bg-blue-400 border-blue-400 rounded-[2px]' />
                            {props.payload.formetTime}
                        </div>];
                    }}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="#616266" vertical={false} />
                <XAxis
                    dataKey="day"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 5)}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="totalTime" fill="var(--color-totalTime)" radius={4} />
            </BarChart>
        </ChartContainer>
    );
};

export default TimeByDay;
