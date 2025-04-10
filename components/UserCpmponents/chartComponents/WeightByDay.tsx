import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { chartConfig } from '@/lib/utils'
import { ExerciseOptionSession, ExerciseSession, ExercisesessionData } from '@/utils/util'
import React from 'react'
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts'

const WeightByDay = ({ data }: { data: any }) => {

    const totalWeightByDay = Object.values(
        data?.sessions.flatMap((session: ExerciseSession) => {
            if (!session.createdAt) return;
            const day = new Date(session.createdAt).toLocaleString("ko-KR", {
                weekday: "long",
            });
            return {
                day,
                totalWeight: session.exercises
                    .map((exercise: ExerciseOptionSession) => {
                        return exercise.session
                            .map((s: ExercisesessionData) => s.weight * s.reps)
                            .reduce((acc, cur) => acc + cur, 0);
                    })
                    .reduce((acc, cur) => acc + cur, 0),
            };
        }).reduce((acc: Record<string, { day: string; totalWeight: number }>, cur: any) => {
            if (acc[cur.day]) {
                acc[cur.day].totalWeight += cur.totalWeight;
            } else {
                acc[cur.day] = cur;
            }
            return acc;
        }, {})
    );

    const CustomEvenIndexLabel = (props: any) => {
        // LabelList는 기본적으로 모든 인덱스에 대해 레이블을 렌더링합니다.
        // 여기서는 짝수 인덱스에 대해서만 렌더링하도록 필터링합니다.
        // props는 LabelList에서 전달된 props입니다.
        const { x, y, value, index } = props;
        if (index % 2 !== 0) return null;
        return (
            <text
                x={x}
                y={y - 12} // offset 대신 직접 위치 조정
                textAnchor="middle"
                className="fill-foreground text-[12px]"
            >
                {`${value} kg`}
            </text>
        );
    };
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
                    cursor={true}
                    content={<ChartTooltipContent indicator="line" />}
                    formatter={(value, name, props) => {
                        return (
                            <div className="grid gap-1.5">
                                <div className="flex w-full flex-wrap items-stretch gap-2 [&amp;>svg]:h-2.5 [&amp;>svg]:w-2.5 [&amp;>svg]:text-muted-foreground">
                                    <div className="shrink-0 rounded-[2px] border-blue-400 bg-blue-400 w-1">
                                    </div>
                                    <div className="flex flex-1 justify-between leading-none items-end gap-2">
                                        <div className="grid gap-1.5">
                                            <div className="font-medium">{props.payload.day}</div>
                                            <span className="text-muted-foreground">횟수 x 무게(kg) </span>
                                        </div>
                                        <span className="font-mono font-medium tabular-nums text-foreground">  {props.payload.totalWeight} kg</span>
                                    </div>
                                </div>
                            </div>)
                    }}


                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                    dataKey="totalWeight"
                    type="natural"
                    stroke="var(--color-totalWeight)"
                    strokeWidth={2}
                    dot={{
                        fill: "var(--color-totalWeight)",
                    }}
                    activeDot={{
                        r: 6,
                    }}
                >
                    <LabelList
                        content={<CustomEvenIndexLabel />}
                    />
                </Line>
            </LineChart>
        </ChartContainer>
    )
}

export default WeightByDay