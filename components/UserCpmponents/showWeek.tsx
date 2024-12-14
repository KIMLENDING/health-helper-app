'use client';

import React from 'react'
import LoadingSpinner from '../LayoutCompents/LoadingSpinner';
import { Card, CardTitle } from '../ui/card';

interface ShowWeekProps {
    data: any; // message, session:ExerciseSession[]
    isLoading: boolean;
    isError: boolean;
}

const ShowWeek = ({ data, isLoading, isError }: ShowWeekProps) => {

    console.log(data)
    const getCurrentWeekDates = () => {
        // 오늘 날짜를 기준으로 이번주 일요일부터 토요일까지의 날짜를 배열로 반환
        const today = new Date();
        const sunday = new Date(today);
        sunday.setDate(sunday.getDate() - sunday.getDay()); // 일요일 날짜 구하기
        return Array(7)
            .fill(null)
            .map((_, i) => {
                const date = new Date(sunday);
                date.setDate(sunday.getDate() + i);
                return date;
            });
    };
    const weekDates = getCurrentWeekDates();
    const days = weekDates.map((date, index) => ({
        label: ["일", "월", "화", "수", "목", "금", "토"][index],
        name: date.toLocaleString("ko-KR", {
            weekday: "long",
        }),
        date: date,
    }));


    const getExerciseStatusForDay = (dayName: any) => {
        return data.sessions.some((session: any) => {
            const date = new Date(session.createdAt);
            return (
                date.toLocaleString("ko-KR", {
                    weekday: "long",
                }) === dayName
            );
        });
    };


    return (
        <section className="mx-auto w-full max-w-3xl rounded-xl ">
            <CardTitle className='my-3 font-extrabold text-2xl'>
                <div className='flex flex-row gap-2 items-center hover:underline'>
                    주간 히스토리
                </div>
            </CardTitle>
            <div className=' bg-muted/50 p-2 rounded-xl'>
                {
                    isLoading ? <div className='w-full flex justify-center items-center h-8'><LoadingSpinner /></div> :
                        <Card className="aspect-auto flex justify-between items-center gap-2 sm:gap-4 p-4">
                            {days.map((day, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <div
                                        className={`
                                w-8 h-8 sm:w-14 sm:h-14 
                                rounded-full 
                                border-2
                                flex flex-col items-center justify-center
                                transition-colors duration-200
                                ${getExerciseStatusForDay(day.name) ? "bg-green-500 border-green-700 text-white" : "border-gray-300 bg-white text-gray-600"}
                                `}
                                        role="status"
                                        aria-label={`Exercise status for ${day.name}`}
                                    >
                                        <span className="text-sm sm:text-base font-semibold">
                                            {day.date.getDate()}
                                        </span>
                                    </div>
                                    <span className="mt-2 text-sm sm:text-base font-semibold ">
                                        {day.label}
                                    </span>
                                </div>
                            ))}
                        </Card>
                }
            </div>

            <div>{isError && '새로고침해 보세요'}</div>
        </section>
    );
}

export default ShowWeek