import React from 'react'
import CardContainer from './chartComponents/CardContainer';
import TitlebyDay from './chartComponents/TitlebyDay';
import TimeByDay from './chartComponents/TimeByDay';
import WeightByDay from './chartComponents/WeightByDay';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { useSidebar } from '../ui/sidebar';

interface ShowChartProps {
    data: any; // message, session:ExerciseSession[]
    isLoading: boolean;
    isError: boolean;
}





const ShowChart = ({ data, isLoading, isError }: ShowChartProps) => {

    const { isMobile } = useSidebar();

    return (
        <section className="mx-auto w-full max-w-3xl rounded-xl overflow-hidden">

            <Carousel opts={{
                align: "start",
            }}
                orientation={isMobile ? "vertical" : 'horizontal'} className='bg-muted/50 p-2 rounded-xl  w-full' >
                <CarouselContent className={isMobile ? 'p-2 max-h-[320px]' : 'p-5'} >
                    <CarouselItem >
                        <CardContainer title='주간 운동 종목' >
                            <TitlebyDay data={data} />
                        </CardContainer>
                    </CarouselItem>
                    <CarouselItem >
                        <CardContainer title='주간 운동 시간' >
                            <TimeByDay data={data} />
                        </CardContainer>
                    </CarouselItem>
                    <CarouselItem >
                        <CardContainer title='주간 운동량' >
                            <WeightByDay data={data} />
                        </CardContainer>
                    </CarouselItem>
                </CarouselContent>
                {!isMobile &&
                    <>
                        <CarouselPrevious />
                        <CarouselNext />
                    </>
                }
            </Carousel>
        </section>
    )
}

export default ShowChart


