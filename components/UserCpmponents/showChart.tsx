'use client'
import React from 'react'
import CardContainer from './chartComponents/CardContainer';
import TitlebyDay from './chartComponents/TitlebyDay';
import TimeByDay from './chartComponents/TimeByDay';
import WeightByDay from './chartComponents/WeightByDay';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { useSidebar } from '../ui/sidebar';
import WeightByPart from './chartComponents/WeightByPart';
import { useWeekSessions } from '@/server/queries';


const ShowChart = () => {
    const { data, isError, isLoading } = useWeekSessions(); // 필요한 운동 계획 데이터를 가져옵니다.
    const { isMobile } = useSidebar();
    return (
        <section className="mx-auto w-full max-w-3xl rounded-xl ">
            <Carousel opts={{
                align: "start",
                slidesToScroll: 1,
            }}
                orientation={isMobile ? "vertical" : 'horizontal'} className='bg-muted/50  rounded-xl ' >
                <CarouselContent className={` ${isMobile ? 'h-[17rem] ' : ''} select-none`} >
                    <CarouselItem >
                        <CardContainer title='주간 운동 종목 Top 5'  >
                            <TitlebyDay data={data} />
                        </CardContainer>
                    </CarouselItem>
                    <CarouselItem >
                        <CardContainer title='주간 운동 시간' >
                            <TimeByDay data={data} />
                        </CardContainer>
                    </CarouselItem>
                    <CarouselItem >
                        <CardContainer title='주간 운동량(kg)' >
                            <WeightByDay data={data} />
                        </CardContainer>
                    </CarouselItem>
                    <CarouselItem >
                        <CardContainer title='주간 부위별 운동량(kg)' >
                            <WeightByPart data={data} />
                        </CardContainer>
                    </CarouselItem>
                </CarouselContent>
                {
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


