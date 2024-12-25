import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { chartConfig } from '@/lib/utils';
import { ExerciseOptionSession, ExerciseSession } from '@/utils/util';
import React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const TimeByDay = ({ data }: { data: any }) => {


    const totalTimeByDay = data?.sessions.flatMap((session: ExerciseSession) => {
        const totalTime = session.exercises.map((exercise: ExerciseOptionSession) => {
            return exercise.repTime || 0;
        }).reduce((acc, cur) => acc + cur, 0);
        const formetTimeM = Math.floor(totalTime / 60);
        const formetTimeS = totalTime % 60;
        const formetTime = `${formetTimeM}분 ${formetTimeS}초`
        if (!session.createdAt) return { day: '?요일', formetTime, totalTime };;
        const day = new Date(session.createdAt).toLocaleString("ko-KR", {
            weekday: "long",
        });
        return { day, formetTime, totalTime };
    });
    return (
        <ChartContainer config={chartConfig} className={`min-h-[200px] aspect-auto w-full`}>
            <BarChart accessibilityLayer data={totalTimeByDay}
                margin={{
                    top: 20,
                    left: 12,
                    right: 12,
                }}

            >

                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="day"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />}

                    formatter={(value, name, props) => {
                        return [<div
                            key="totalTime" // key값을 넣어주지 않으면 배포시 jsx에러가 발생합니다. 이유 배열로 값을 반환 하기 때문에 키를 넣어 줘야함
                            className='flex flex-row gap-1 items-center'>
                            <div className='h-2.5 w-2.5 bg-blue-400 border-blue-400 rounded-[2px]' />
                            {props.payload.formetTime}
                        </div>];
                    }}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="totalTime" fill="var(--color-totalTime)" radius={4} />
            </BarChart>
        </ChartContainer>

    )
}

export default TimeByDay