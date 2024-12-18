import React from 'react'
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts';
import { ExerciseOptionSession, ExerciseSession, ExercisesessionData } from '@/utils/util';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

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

    const chartData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
    ]
    const totalWeightsByTitle = data?.sessions.flatMap((session: ExerciseSession) => {
        return session.exercises.map((exercise: ExerciseOptionSession) => {
            const totalWeight = exercise.session.map((s: ExercisesessionData) => {
                return s.weight * s.reps;
            }).reduce((acc, cur) => acc + cur, 0);
            return { title: exercise.title, totalWeight };
        });
    }).reduce((acc: any, cur: any) => {
        const existing = acc.find((item: any) => item.title === cur.title);
        if (existing) {
            existing.totalWeight += cur.totalWeight;
        } else {
            acc.push(cur);
        }
        return acc;
    }, []);

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

    const totalWeightByDay = data?.sessions.flatMap((session: ExerciseSession) => {
        if (!session.createdAt) return;
        const day = new Date(session.createdAt).toLocaleString("ko-KR", {
            weekday: "long",
        });
        return {
            day, totalWeight: session.exercises.map((exercise: ExerciseOptionSession) => {
                return exercise.session.map((s: ExercisesessionData) => {
                    return s.weight * s.reps;
                }).reduce((acc, cur) => acc + cur, 0);
            }).reduce((acc, cur) => acc + cur, 0)
        };
    });
    console.log(data)
    console.log('요일 별  무게 합산', totalWeightByDay)
    return (
        <section className="mx-auto w-full max-w-3xl rounded-xl ">
            <div className='rounded-xl bg-muted/50 p-2 space-y-2'>


                <Card>
                    <CardHeader className='pb-0'>
                        <CardTitle>주간 운동 종목</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                            <BarChart accessibilityLayer data={totalWeightsByTitle}
                                margin={{
                                    top: 20,
                                    left: 12,
                                    right: 12,
                                }}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="title"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 10)}
                                />
                                <ChartTooltip content={<ChartTooltipContent />}
                                    formatter={(value, name, props) => {
                                        return <div>
                                            <div className='flex flex-row gap-1 items-center'>
                                                <div className='h-2.5 w-2.5 bg-blue-400 border-blue-400 rounded-[2px]' />
                                                {props.payload.totalWeight} kg
                                            </div>
                                        </div>
                                    }}
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="totalWeight" fill="var(--color-mobile)" radius={4} >

                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='pb-0'>
                        <CardTitle>주간 운동 시간</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                            <BarChart accessibilityLayer data={totalTimeByDay}
                                margin={{
                                    top: 20,
                                    left: 12,
                                    right: 12,
                                }}>
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
                                <Bar dataKey="totalTime" fill="var(--color-mobile)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='pb-0'>
                        <CardTitle>주간 운동량</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <LineChart
                                accessibilityLayer
                                data={totalWeightByDay}
                                margin={{
                                    top: 20,
                                    left: 25,
                                    right: 20,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="day"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <Line
                                    dataKey="totalWeight"
                                    type="natural"
                                    stroke="var(--color-desktop)"
                                    strokeWidth={2}
                                    dot={{
                                        fill: "var(--color-desktop)",
                                    }}
                                    activeDot={{
                                        r: 6,
                                    }}
                                >
                                    <LabelList
                                        position="top"
                                        offset={12}
                                        className="fill-foreground"
                                        fontSize={12}
                                        formatter={(value: number) => `${value} kg`}
                                    />
                                </Line>
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

export default ShowChart


