import React from 'react'
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts';
import { ExerciseOptionSession, ExerciseSession, ExercisesessionData } from '@/utils/util';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import CardContainer from './chartComponents/CardContainer';
import TitlebyDay from './chartComponents/TitlebyDay';
import TimeByDay from './chartComponents/TimeByDay';
import WeightByDay from './chartComponents/WeightByDay';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';

interface ShowChartProps {
    data: any; // message, session:ExerciseSession[]
    isLoading: boolean;
    isError: boolean;
}





const ShowChart = ({ data, isLoading, isError }: ShowChartProps) => {







    return (
        <section className="mx-auto w-full max-w-3xl rounded-xl ">

            <Carousel className='mx-8 bg-muted/50 p-2 rounded-xl'>
                <CarouselContent>
                    <CarouselItem>
                        <CardContainer title='주간 운동 종목' >
                            <TitlebyDay data={data} />
                        </CardContainer>
                    </CarouselItem>
                    <CarouselItem>
                        <CardContainer title='주간 운동 시간' >
                            <TimeByDay data={data} />
                        </CardContainer>
                    </CarouselItem>
                    <CarouselItem>
                        <CardContainer title='주간 운동량' >
                            <WeightByDay data={data} />
                        </CardContainer>
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>







        </section>
    )
}

export default ShowChart


