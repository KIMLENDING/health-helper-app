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
    console.log(isMobile)
    return (
        <section className="mx-auto w-full max-w-3xl rounded-xl ">
            {isMobile && <h1 className='text-2xl font-bold text-center mb-3'>주간 히스토리</h1>}
            {/* <Carousel opts={{
                align: "start",
                slidesToScroll: 1,

            }}
                orientation={isMobile ? "vertical" : 'horizontal'} className='bg-muted/50  rounded-xl ' >
                <CarouselContent className={` ${isMobile ? 'p-2  h-96 flex' : 'p-2 ml-0 mr-2'}`} >
                    <CarouselItem className={`${isMobile && ' flex-1  '}`}>
                        <CardContainer title='주간 운동 종목' >
                            <TitlebyDay data={data} />
                        </CardContainer>
                    </CarouselItem>
                    <CarouselItem className={`${isMobile && '  flex-1 '}`}>
                        <CardContainer title='주간 운동 시간' >
                            <TimeByDay data={data} />
                        </CardContainer>
                    </CarouselItem>
                    <CarouselItem className={`${isMobile && '  flex-1 '}`}>
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
            </Carousel> */}

        </section>
    )
}

export default ShowChart


