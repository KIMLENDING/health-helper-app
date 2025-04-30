'use client'
import React, { useState } from 'react'
import CardContainer from './chartComponents/CardContainer';
import TitlebyDay from './chartComponents/TitlebyDay';
import TimeByDay from './chartComponents/TimeByDay';
import WeightByDay from './chartComponents/WeightByDay';
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { useSidebar } from '../ui/sidebar';
import WeightByPart from './chartComponents/WeightByPart';
import { useWeekSessions } from '@/server/queries';
import { Activity, BarChart2, Clock, Dumbbell } from 'lucide-react';
import { Card } from '../ui/card';


const ShowChart = () => {
    const { data, isError, isLoading } = useWeekSessions(); // 필요한 운동 계획 데이터를 가져옵니다.
    const { isMobile } = useSidebar();
    const [activeSlide, setActiveSlide] = useState(0);
    const [api, setApi] = React.useState<CarouselApi>();
    // 차트 정보 배열
    const chartItems = [
        {
            title: '주간 운동 종목 Top 5',
            component: <TitlebyDay data={data} />,
            icon: <BarChart2 className="h-5 w-5 text-blue-500" />
        },
        {
            title: '주간 운동 시간',
            component: <TimeByDay data={data} />,
            icon: <Clock className="h-5 w-5 text-purple-500" />
        },
        {
            title: '주간 운동량(kg)',
            component: <WeightByDay data={data} />,
            icon: <Activity className="h-5 w-5 text-green-500" />
        },
        {
            title: '주간 부위별 운동량(kg)',
            component: <WeightByPart data={data} />,
            icon: <Dumbbell className="h-5 w-5 text-orange-500" />
        }
    ];

    const handleSlideChange = (index: any) => {
        setActiveSlide(index);
    };



    React.useEffect(() => {
        if (!api) {
            return
        }
        api.scrollTo(activeSlide, true)
    }, [activeSlide])



    // 로딩 상태 표시
    if (isLoading) {
        return (
            <section className="mx-auto w-full max-w-4xl  ">
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 animate-pulse">
                    <div className="flex items-center justify-between mb-6">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        <div className="flex gap-2">
                            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        </div>
                    </div>
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </section>
        );
    }

    // 에러 상태 표시
    if (isError) {
        return (
            <section className="mx-auto w-full max-w-4xl ">
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex flex-col items-center justify-center h-64">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p className="text-lg font-semibold mb-2">차트 데이터를 불러오는 중 오류가 발생했습니다</p>
                    <p>잠시 후 다시 시도해주세요</p>
                </div>
            </section>
        );
    }

    return (
        <section className="mx-auto w-full max-w-4xl py-4 space-y-4">
            <Card>
                <div className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-row gap-4 justify-between p-4'} `}>
                    {chartItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleSlideChange(index)}
                            className={`flex items-center gap-2 p-2 rounded-lg transition-all ${activeSlide === index
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'
                                }`}
                        >
                            {item.icon}
                            <span className={isMobile ? 'text-sm' : 'text-xs'}>{item.title}</span>
                        </button>
                    ))}
                </div>
            </Card>

            <Carousel setApi={setApi} opts={{
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


