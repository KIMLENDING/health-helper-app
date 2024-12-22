import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ExerciseOptionSession, ExercisesessionData } from '@/utils/util';
import { TrendingUp } from 'lucide-react';
import React from 'react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

const chartConfig = {
    log_totalTitleByWeight: {
        label: "세트 x 무게(kg)",
        color: "#2563eb",
    },
    log_totalTitleByReps: {
        label: "반복횟수",
        color: "#f84171",
    },
} satisfies ChartConfig;

const TotalTitleByWeight = ({ data }: { data: any }) => {

    const totalTime = data?.exercises.flatMap((exercise: ExerciseOptionSession) => {
        return exercise.repTime || 0;
    }).reduce((acc: any, cur: any) => acc + cur, 0);


    const totalTitleByWeight = data?.exercises.flatMap((exercise: ExerciseOptionSession) => {
        return {
            title: exercise.title,
            totalTitleByWeight: exercise.session.map((s: ExercisesessionData) => {
                return s.weight * s.reps;
            }).reduce((acc, cur) => acc + cur, 0),
            totalTitleByReps: exercise.session.map((s: ExercisesessionData) => {
                return s.reps;
            }).reduce((acc, cur) => acc + cur, 0),
        }
    });

    const formetTime = (time: number | undefined) => {
        if (!time) return '0분 0초';
        const formetTimeH = Math.floor(time / 3600);
        const formetTimeM = Math.floor((time % 3600) / 60);
        const formetTimeS = time % 60;
        return `${formetTimeH}시간 ${formetTimeM}분 ${formetTimeS}초`;
    }


    const applyLogScale = (data: any, key: string) => {
        return data.map((item: any) => ({
            ...item,
            [`log_${key}`]: Math.log(item[key]),
        }));
    };
    const applyLogData = applyLogScale(applyLogScale(totalTitleByWeight, "totalTitleByWeight"), "totalTitleByReps");



    return (
        <section>
            <Card>
                <CardHeader className="items-center pb-4">
                    <CardTitle>운동 분석</CardTitle>
                    <CardDescription>
                        운동별 들어올린 무게를 분석한 차트입니다.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-[1/1] max-h-[300px]"
                    >
                        <RadarChart data={applyLogData} margin={{
                            top: -40,
                            bottom: -10,
                        }}
                            className='w-full h-full'
                        >
                            <ChartTooltip cursor={false}
                                content={<ChartTooltipContent formatter={(value, name, props) => {
                                    const originalValue = name === "log_totalTitleByWeight" ? props.payload.totalTitleByWeight : props.payload.totalTitleByReps;
                                    return (<div className='flex flex-row gap-1 items-center'>
                                        <div className={`h-2.5 w-2.5 ${name === "log_totalTitleByWeight" ? 'bg-blue-400 border-blue-400' : 'bg-red-400 border-red-400'} rounded-[2px] `} />
                                        {name === "log_totalTitleByWeight" ? `${originalValue} kg` : `${originalValue} 회`}
                                    </div>)
                                }} />}

                            />
                            <PolarAngleAxis dataKey="title" />
                            <PolarGrid />
                            <Radar
                                dataKey="log_totalTitleByWeight"
                                fill="var(--color-log_totalTitleByWeight)"
                                fillOpacity={0.6}
                            />
                            <Radar
                                dataKey="log_totalTitleByReps"
                                fill="var(--color-log_totalTitleByReps)"
                                fillOpacity={1}
                            />
                            <ChartLegend className="mt-8" content={<ChartLegendContent />} />
                        </RadarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 font-medium leading-none text-muted-foreground">
                        금일 운동 시간: {formetTime(totalTime)} <TrendingUp className="h-4 w-4" />
                    </div>

                </CardFooter>
            </Card>
        </section>
    )
}

export default TotalTitleByWeight