import React from 'react'
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { ExerciseOptionSession, ExerciseSession, ExercisesessionData } from '@/utils/util';

interface ShowChartProps {
    data: any; // message, session:ExerciseSession[]
    isLoading: boolean;
    isError: boolean;
}

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
    title: {
        label: "Title",
        color: "#60a5fa",
    },
    totalWeight: {
        label: "횟수 x 무게(kg)",
        color: "#2563eb",
    },
    day: {
        label: "요일",
        color: "#2563eb",
    },
    totalTime: {
        label: "운동시간(s)",
        color: "#2563eb",
    }
} satisfies ChartConfig;



const ShowChart = ({ data, isLoading, isError }: ShowChartProps) => {


    const totalWeightsByTitle = data?.sessions.flatMap((session: ExerciseSession) => {
        return session.exercises.map((exercise: ExerciseOptionSession) => {
            const totalWeight = exercise.session.map((s: ExercisesessionData) => {
                return s.weight * s.reps;
            }).reduce((acc, cur) => acc + cur, 0);
            return { title: exercise.title, totalWeight };
        });
    });

    const totalTimeByDay = data?.sessions.flatMap((session: ExerciseSession) => {
        const totalTime = session.exercises.map((exercise: ExerciseOptionSession) => {
            return exercise.repTime || 0;
        }).reduce((acc, cur) => acc + cur, 0);
        const formetTimeM = Math.floor(totalTime / 60);
        const formetTimeS = totalTime % 60;
        const formetTime = `${formetTimeM}분 ${formetTimeS}초`
        if (!session.createdAt) return { day: '생성일자자', formetTime, totalTime };;
        const day = new Date(session.createdAt).toLocaleString("ko-KR", {
            weekday: "long",
        });
        return { day, formetTime, totalTime };
    });
    console.log('총 무게', totalTimeByDay)
    return (
        <section className="mx-auto w-full max-w-3xl rounded-xl ">

            1. 주간 총 운동 시간
            2. 주간 총 중량
            3. 주간 총 세트
            4. 주간 총 횟수
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={totalWeightsByTitle}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="title"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="totalWeight" fill="var(--color-mobile)" radius={4} />
                </BarChart>
            </ChartContainer>

            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={totalTimeByDay}>
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
                            return [<div className='flex flex-row gap-1 items-center'>
                                <div className='h-2.5 w-2.5 bg-blue-400 border-blue-400 rounded-[2px]'></div>
                                {props.payload.formetTime}
                            </div>];
                        }}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="totalTime" fill="var(--color-mobile)" radius={4} />
                </BarChart>
            </ChartContainer>
        </section>
    )
}

export default ShowChart


