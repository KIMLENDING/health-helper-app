



import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

import React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';


const chartConfig = {
    part: {
        label: "운동부위",
        color: "#2563eb",
    },
    weight: {
        label: "무게(kg)",
        color: "#2563eb",
    }

} satisfies ChartConfig;
const WeightByPart = ({ data }: { data: any }) => {

    const tagFilter = ['가슴', '어깨', '등', '하체']
    const result = tagFilter.reduce((acc: any, tag: string) => {
        acc[tag] = 0;
        return acc;
    }, {});


    //  ['가슴', '어깨', '등', '하체'] 태그별 총 무게 계산
    data?.sessions.flatMap((session: any) => {
        return session.exercises.map((exercise: any) => {
            return {
                totalWeight: exercise.session.map((s: any) => {
                    return s.reps * s.weight // 한 세트당 무게
                }).reduce((acc: number, cur: number) => acc + cur, 0),
                tag: exercise.exerciseId.tags.filter((tags: any) => {
                    return tagFilter.includes(tags) // 필터링된 태그만 반환 ['가슴', '어깨', '등', '하체']
                }
                ),
            }
        })
    }).forEach((item: any) => {
        item.tag.forEach((tag: any) => {
            if (tagFilter.includes(tag)) {
                result[tag] += item.totalWeight; // 해당 태그의 총 무게
            }
        });
    });
    const b = Object.entries(result).map(([key, value]) => {
        return { part: key, weight: value }
    });
    console.log(result)

    return (
        <ChartContainer config={chartConfig} className={`min-h-[200px] aspect-auto w-full`}>
            <BarChart accessibilityLayer data={b}
                margin={{
                    top: 20,
                    left: 12,
                    right: 12,
                }}

            >

                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="part"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="weight" fill="var(--color-weight)" radius={4} />
            </BarChart>
        </ChartContainer>

    )
}
export default WeightByPart