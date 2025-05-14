import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ExerciseOptionSession, ExercisesessionData } from '@/utils/util';
import { Clock, Dumbbell, TrendingUp, Info } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, } from 'recharts';

const chartConfig = {
    log_totalTitleByWeight: {
        label: "세트 × 무게(kg)",
        color: "#3b82f6",
    },
    log_totalTitleByReps: {
        label: "반복횟수",
        color: "#ec4899",
    },
} satisfies ChartConfig;

const TotalTitleByWeight = ({ data }: { data: any }) => {
    const [applyLogData, setApplyLogData] = useState([]);

    const totalTime = data?.exercises.flatMap((exercise: ExerciseOptionSession) => {
        return exercise.repTime || 0;
    }).reduce((acc: any, cur: any) => acc + cur, 0);

    const totalWeight = data?.exercises.flatMap((exercise: ExerciseOptionSession) => {
        return exercise.session.map((s: ExercisesessionData) => {
            return s.weight * s.reps;
        }).reduce((acc, cur) => acc + cur, 0);
    }).reduce((acc: any, cur: any) => acc + cur, 0);

    const totalReps = data?.exercises.flatMap((exercise: ExerciseOptionSession) => {
        return exercise.session.map((s: ExercisesessionData) => {
            return s.reps;
        }).reduce((acc, cur) => acc + cur, 0);
    }).reduce((acc: any, cur: any) => acc + cur, 0);

    const totalTitleByWeight = data?.exercises.flatMap((exercise: ExerciseOptionSession) => {
        return {
            title: exercise.exerciseId.title,
            totalTitleByWeight: exercise.session.map((s: ExercisesessionData) => {
                return s.weight * s.reps;
            }).reduce((acc, cur) => acc + cur, 0),
            totalTitleByReps: exercise.session.map((s: ExercisesessionData) => {
                return s.reps;
            }).reduce((acc, cur) => acc + cur, 0),
        }
    });

    const formatTime = (time: number | undefined) => {
        if (!time) return '0분 0초';
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);

        if (hours > 0) {
            return `${hours}시간 ${minutes}분 ${seconds}초`;
        } else if (minutes > 0) {
            return `${minutes}분 ${seconds}초`;
        } else {
            return `${seconds}초`;
        }
    }

    useEffect(() => {
        const applyLogScale = (data: any, key: string) => {
            if (!data) return [];

            return data.map((item: any) => ({
                ...item,
                [`log_${key}`]: item[key] > 0 ? Math.log(item[key]) : 0,
            }));
        };
        const totalTitleByWeightLog = applyLogScale(totalTitleByWeight, "totalTitleByWeight");
        const totalTitleByRepsLog = applyLogScale(totalTitleByWeightLog, "totalTitleByReps");
        setApplyLogData(totalTitleByRepsLog);
    }, [data]);

    return (
        <Card className="overflow-hidden border-none ">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg">
                            <Dumbbell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="text-xl">운동 분석</CardTitle>
                    </div>
                </div>
                <CardDescription className="mt-2 text-sm text-gray-600 dark:text-gray-400 break-words">
                    운동별 들어올린 무게와 반복 횟수를 분석한 차트입니다.
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 pb-4">
                {applyLogData.length > 2 ? (
                    <div className="relative">
                        <ChartContainer
                            config={chartConfig}
                            className="mx-auto aspect-[1/1] max-h-[45vh] max-w-[45vh]"
                        >
                            <RadarChart
                                data={applyLogData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 30,
                                    bottom: 10,
                                }}
                                className="w-full h-full"
                            >
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent
                                        indicator="line"
                                        formatter={(value, name, props) => {
                                            const originalValue = name === "무게"
                                                ? props.payload.totalTitleByWeight
                                                : props.payload.totalTitleByReps;

                                            return (
                                                <div className="flex flex-row gap-1 items-center py-1">
                                                    <div className={`h-3 w-3 ${name === "무게"
                                                        ? 'bg-blue-500 border-blue-500'
                                                        : 'bg-pink-500 border-pink-500'} rounded-full`} />
                                                    <span className="font-medium">
                                                        {name === "무게"
                                                            ? `${originalValue} kg`
                                                            : `${originalValue} 회`}
                                                    </span>
                                                </div>
                                            );
                                        }}
                                    />}
                                />
                                <PolarAngleAxis
                                    dataKey="title"
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    stroke="#E5E7EB"
                                />
                                <PolarGrid stroke="#E5E7EB" />
                                <Radar
                                    name="무게"
                                    dataKey="log_totalTitleByWeight"
                                    stroke="#3b82f6"
                                    fill="#3b82f6"
                                    fillOpacity={0.5}
                                    strokeWidth={2}
                                />
                                <Radar
                                    name="반복"
                                    dataKey="log_totalTitleByReps"
                                    stroke="#ec4899"
                                    fill="#ec4899"
                                    fillOpacity={0.4}
                                    strokeWidth={2}
                                />
                                <ChartLegend
                                    className="mt-4"
                                    content={
                                        <ChartLegendContent
                                            className="flex justify-center gap-6 pt-2"
                                        />
                                    }
                                />
                            </RadarChart>
                        </ChartContainer>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">총 무게</p>
                                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{totalWeight?.toLocaleString() || 0} kg</p>
                            </div>
                            <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">총 반복 횟수</p>
                                <p className="text-xl font-bold text-pink-600 dark:text-pink-400">{totalReps?.toLocaleString() || 0} 회</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
                        <Info className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-3" />
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">차트를 표시할 수 없습니다</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            운동 종목이 3개 이상일 때 레이더 차트가 표시됩니다.
                        </p>
                    </div>
                )}
            </CardContent>

            <CardFooter className="bg-gray-50 dark:bg-zinc-800/50 px-6 py-4 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 text-blue-500" />
                        운동 시간:
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                            {formatTime(totalTime)}
                        </span>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default TotalTitleByWeight;