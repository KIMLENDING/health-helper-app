import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ExerciseOptionSession, ExercisesessionData } from '@/utils/util';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Activity, Layers, Repeat, Weight } from 'lucide-react';

const chartConfig = {
    sessionSet: {
        label: "세트",
        color: "#6366f1", // indigo-500
    },
    sessionRep: {
        label: "반복 횟수",
        color: "#ec4899", // pink-500
    },
    sessionWeight: {
        label: "무게(kg)",
        color: "#14b8a6", // teal-500
    },
} satisfies ChartConfig;

const TotalTitleBySession = ({ data }: { data: any }) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [activeItem, setActiveItem] = useState<number[]>([]);

    const titleBySession = data?.exercises.flatMap((exercise: ExerciseOptionSession) => {
        return {
            title: exercise.exerciseId.title,
            totalWeight: exercise.session.reduce((acc: number, s: ExercisesessionData) => acc + (s.weight * s.reps), 0),
            totalReps: exercise.session.reduce((acc: number, s: ExercisesessionData) => acc + s.reps, 0),
            session: exercise.session.map((s: ExercisesessionData) => {
                return {
                    sessionSet: s.set,
                    sessionRep: s.reps,
                    sessionWeight: s.weight,
                    // 차트에 표시될 레이블 텍스트 추가
                    repLabel: `${s.reps}회`,
                    weightLabel: `${s.weight}kg`
                }
            }),
        }
    });

    // 가장 많은 무게를 들은 운동 찾기
    const maxWeightExercise = titleBySession?.reduce((max: any, current: any) =>
        (!max || current.totalWeight > max.totalWeight) ? current : max, null);
    console.log(activeItem)
    return (
        <Card className="border border-gray-200 dark:border-zinc-800 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg">
                        <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">세션별 운동 분석</h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 ml-10">
                    각 운동별 세트, 반복 횟수, 무게를 세부적으로 분석합니다.
                </p>
            </div>

            {titleBySession && titleBySession.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                    {titleBySession.map((item: any, index: number) => {
                        const isMaxWeight = maxWeightExercise?.title === item.title;

                        return (
                            <Accordion
                                type="single"
                                collapsible
                                key={item.title}
                                onValueChange={() => setActiveItem(pre => {

                                    return pre.includes(index) ? pre.filter(item => item !== index) : [...pre, index]
                                }
                                )}
                            >
                                <AccordionItem
                                    value={item.title}
                                    className={`border-0 ${isMaxWeight ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
                                        }`}
                                >
                                    <AccordionTrigger className="py-0 hover:no-underline group px-4">
                                        <div className="flex items-center justify-between w-full py-4 px-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${isMaxWeight
                                                    ? 'bg-indigo-100 dark:bg-indigo-800/50'
                                                    : 'bg-gray-100 dark:bg-zinc-800'
                                                    }`}>
                                                    <Layers className={`h-5 w-5 ${isMaxWeight
                                                        ? 'text-indigo-600 dark:text-indigo-400'
                                                        : 'text-gray-500 dark:text-gray-400'
                                                        }`} />
                                                </div>
                                                <div className="text-left">
                                                    <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                        {item.title}
                                                        {isMaxWeight && (
                                                            <span className="ml-2 text-xs font-normal text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 px-2 py-0.5 rounded-full">
                                                                최대 무게
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                        <div className="flex items-center gap-1">
                                                            <Weight className="h-3 w-3" />
                                                            <span>{item.totalWeight.toLocaleString()}kg</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Repeat className="h-3 w-3" />
                                                            <span>{item.totalReps}회</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Layers className="h-3 w-3" />
                                                            <span>{item.session.length}세트</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="hidden md:block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {activeItem.includes(index) ? '접기' : '자세히'}
                                            </div>
                                        </div>
                                    </AccordionTrigger>

                                    <AccordionContent className="px-6 pb-6">
                                        <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-4 border border-gray-100 dark:border-zinc-800">
                                            <div className="mb-3 px-1">
                                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">세트별 분석</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">각 세트별 무게와 반복 횟수를 비교해 보세요.</p>
                                            </div>

                                            <div className="aspect-video">
                                                <ChartContainer config={chartConfig} className="w-full h-full">

                                                    <BarChart
                                                        data={item.session}
                                                        margin={{
                                                            top: 20,
                                                            right: 30,
                                                            left: 0,
                                                            bottom: 10,
                                                        }}
                                                    >
                                                        <ChartTooltip
                                                            content={
                                                                <ChartTooltipContent
                                                                    indicator="line"
                                                                    className="shadow-lg border  border-zinc-100 dark:border-zinc-700"

                                                                />
                                                            }
                                                            formatter={(value, name, props) => {
                                                                const tmp = (key: any) => {
                                                                    const color = key === 'sessionRep' ? 'bg-pink-500' : 'bg-teal-500';
                                                                    return (
                                                                        <div className='flex flex-row gap-1 items-center'>
                                                                            <div className={`h-2.5 w-2.5 ${color} rounded-[2px]`} />
                                                                            {props.payload[key]} {key === 'sessionRep' ? '회' : 'kg'}
                                                                        </div>
                                                                    )
                                                                }
                                                                return tmp(props.dataKey)
                                                            }}
                                                        />
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                                        <XAxis
                                                            dataKey="sessionSet"
                                                            tickLine={false}
                                                            tickMargin={8}
                                                            axisLine={false}
                                                            label={{
                                                                value: '세트',
                                                                position: 'insideBottomRight',
                                                                offset: -5,
                                                                fill: '#6b7280',
                                                                fontSize: 12
                                                            }}
                                                        />
                                                        <YAxis
                                                            axisLine={false}
                                                            tickLine={false}
                                                            tickMargin={8}
                                                            fontSize={12}
                                                        />

                                                        <Bar
                                                            name="반복 횟수"
                                                            dataKey="sessionRep"
                                                            fill={chartConfig.sessionRep.color}
                                                            radius={[4, 4, 0, 0]}
                                                            barSize={isDesktop ? 20 : 14}
                                                        >
                                                            <LabelList
                                                                dataKey="repLabel"
                                                                position="top"
                                                                fill={chartConfig.sessionRep.color}
                                                                fontSize={isDesktop ? 12 : 10}
                                                                fontWeight="500"
                                                            />
                                                        </Bar>
                                                        <Bar
                                                            name="무게(kg)"
                                                            dataKey="sessionWeight"
                                                            fill={chartConfig.sessionWeight.color}
                                                            radius={[4, 4, 0, 0]}
                                                            barSize={isDesktop ? 20 : 14}
                                                        >
                                                            <LabelList
                                                                dataKey="weightLabel"
                                                                position="top"
                                                                fill={chartConfig.sessionWeight.color}
                                                                fontSize={isDesktop ? 12 : 10}
                                                                fontWeight="500"
                                                            />
                                                        </Bar>
                                                    </BarChart>
                                                </ChartContainer>
                                            </div>

                                            <div className="mt-4 grid grid-cols-3 gap-2">
                                                <div className="flex flex-col items-center justify-center bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">세트 수</span>
                                                    <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{item.session.length}</span>
                                                </div>
                                                <div className="flex flex-col items-center justify-center bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">총 횟수</span>
                                                    <span className="text-lg font-semibold text-pink-600 dark:text-pink-400">{item.totalReps}회</span>
                                                </div>
                                                <div className="flex flex-col items-center justify-center bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">총 무게</span>
                                                    <span className="text-lg font-semibold text-teal-600 dark:text-teal-400">{item.totalWeight}kg</span>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="bg-gray-100 dark:bg-zinc-800 p-3 rounded-full mb-3">
                        <Activity className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">운동 데이터가 없습니다</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        운동을 기록하면 세션별 분석이 이곳에 표시됩니다.
                    </p>
                </div>
            )}
        </Card>
    );
};

export default TotalTitleBySession;