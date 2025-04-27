
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useSidebar } from '@/components/ui/sidebar';
import { chartConfig } from '@/lib/utils';
import { ExerciseOptionSession, ExerciseSession, ExercisesessionData } from '@/utils/util';
import React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const TitlebyDay = ({ data, }: { data: any }) => {
    const { isMobile } = useSidebar();

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
    }, []).sort((a: any, b: any) => b.totalWeight - a.totalWeight).slice(0, 5);

    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] aspect-auto w-full">
            <BarChart accessibilityLayer data={totalWeightsByTitle}
                margin={{
                    top: 20,
                }}
                barSize={isMobile ? 20 : 50}
            >
                <ChartTooltip content={<ChartTooltipContent />}
                    formatter={(value, name, props) => {
                        return (
                            <div>
                                <div className='flex flex-row gap-1 items-center'>
                                    <div className='h-2.5 w-2.5 bg-blue-400 border-blue-400 rounded-[2px]' />
                                    {props.payload.totalWeight} kg
                                </div>
                            </div>
                        )
                    }}

                />
                <CartesianGrid strokeDasharray="3 3" stroke="#616266" vertical={false} />
                <XAxis
                    dataKey="title"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 5)}
                />

                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="totalWeight" fill="var(--color-title)" radius={4}  >
                </Bar>
            </BarChart>
        </ChartContainer>

    )
}

export default TitlebyDay