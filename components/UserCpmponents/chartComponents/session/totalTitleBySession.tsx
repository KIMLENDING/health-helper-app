import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ExerciseOptionSession, ExercisesessionData } from '@/utils/util';
import React from 'react'
import { Bar, BarChart, LabelList, XAxis } from 'recharts';

const chartConfig = {
    sessionSet: {
        label: "세트",
        color: "hsl(var(--chart-1))",
    },
    sessionRep: {
        label: "반복 횟수",
        color: "hsl(var(--chart-2))",
    },
    sessionWeight: {
        label: "무게(kg)",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

const TotalTitleBySession = ({ data }: { data: any }) => {
    const titleBySession = data?.exercises.flatMap((exercise: ExerciseOptionSession) => {
        return {
            title: exercise.title,
            session: exercise.session.map((s: ExercisesessionData) => {
                return { sessionSet: s.set, sessionRep: s.reps, sessionWeight: s.weight }
            }),
        }
    });

    console.log(titleBySession);
    return (
        <div>

            {
                titleBySession?.map((item: any) => {
                    return (
                        <Accordion type="single" collapsible key={item.title}>
                            <AccordionItem value={item.title} >
                                <AccordionTrigger><CardHeader>
                                    <CardTitle>{item.title}</CardTitle>

                                </CardHeader></AccordionTrigger>
                                <AccordionContent>


                                    <CardContent>
                                        <ChartContainer config={chartConfig}>
                                            <BarChart accessibilityLayer data={item.session}>
                                                <XAxis
                                                    dataKey="sessionSet"
                                                    tickLine={false}
                                                    tickMargin={10}
                                                    axisLine={false}
                                                />
                                                <Bar
                                                    dataKey="sessionRep"
                                                    fill="var(--color-sessionRep)"
                                                    radius={4}
                                                >
                                                    <LabelList
                                                        position="top"
                                                        offset={12}
                                                        className="fill-foreground"
                                                        fontSize={12}
                                                    />
                                                </Bar>
                                                <Bar
                                                    dataKey="sessionWeight"
                                                    fill="var(--color-sessionWeight)"
                                                    radius={4}
                                                >
                                                    <LabelList
                                                        position="top"
                                                        offset={12}
                                                        className="fill-foreground"
                                                        fontSize={12}
                                                    />
                                                </Bar>
                                                <ChartTooltip
                                                    content={
                                                        <ChartTooltipContent
                                                            indicator='line'
                                                        />
                                                    }
                                                    cursor={false}
                                                    defaultIndex={1}
                                                />
                                            </BarChart>
                                        </ChartContainer>
                                    </CardContent>


                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                    )

                })
            }

        </div>
    )
}

export default TotalTitleBySession