'use client';
import { useWeekSessions } from '@/server/queries';
import React from 'react'
import LoadingSpinner from '../LayoutCompents/LoadingSpinner';
import { Card } from '../ui/card';

const ShowWeek = () => {
    const { data, isLoading, isError } = useWeekSessions();
    // console.log(data.sessions.map((session: any) => session.createdAt));
    const exerciseData = {
        completedWorkouts: [
            {
                date: {
                    $date: "2024-01-15T00:00:00Z",
                },
            },
            {
                date: {
                    $date: "2024-01-17T00:00:00Z",
                },
            },
            {
                date: {
                    $date: "2024-01-19T00:00:00Z",
                },
            },
        ],
    };
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

    if (isLoading) return <div className='w-full flex justify-center items-center'><LoadingSpinner /></div>;
    return (
        <section className="mx-auto w-full max-w-3xl rounded-xl">
            <Card className="flex justify-between items-center gap-2 sm:gap-4 p-4">
                {days.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div
                            className={`
                    w-10 h-10 sm:w-14 sm:h-14 
                    rounded-full 
                    border-2
                    flex flex-col items-center justify-center
                    transition-colors duration-200
                    ${getExerciseStatusForDay(day.name) ? "bg-green-500 border-green-700 text-white" : "border-gray-300 bg-white text-gray-600"}
                  `}
                            role="status"
                            aria-label={`Exercise status for ${day.name}`}
                        >
                            <span className="text-xs sm:text-sm font-medium">
                                {day.date.getDate()}
                            </span>
                        </div>
                        <span className="mt-2 text-sm sm:text-base font-medium ">
                            {day.label}
                        </span>
                    </div>
                ))}
            </Card>
        </section>
    );
}

export default ShowWeek