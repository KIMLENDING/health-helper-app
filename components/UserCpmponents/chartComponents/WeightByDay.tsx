import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useSidebar } from '@/components/ui/sidebar'
import { chartConfig } from '@/lib/utils'
import { ExerciseOptionSession, ExerciseSession, ExercisesessionData } from '@/utils/util'
import React from 'react'
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts'

const WeightByDay = ({ data }: { data: any }) => {

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
    return (
        <ChartContainer config={chartConfig} className="aspect-auto min-h-[200px] w-full">
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
                <ChartLegend content={<ChartLegendContent />} />
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
    )
}

export default WeightByDay