'use client';
import { useWeekSessions } from '@/server/queries';
import React from 'react'

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
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(monday.getDate() - monday.getDay() + 1);
        return Array(7)
            .fill(null)
            .map((_, i) => {
                const date = new Date(monday);
                date.setDate(monday.getDate() + i);
                return date;
            });
    };
    const weekDates = getCurrentWeekDates();
    const days = weekDates.map((date, index) => ({
        label: ["월", "화", "수", "목", "금", "토", "일"][index],
        name: date.toLocaleString("ko-KR", {
            weekday: "long",
        }),
        date: date,
    }));
    const getExerciseStatusForDay = (dayName: any) => {
        return exerciseData.completedWorkouts.some((workout) => {
            const date = new Date(workout.date.$date);
            return (
                date.toLocaleString("ko-KR", {
                    weekday: "long",
                }) === dayName
            );
        });
    };
    if (isLoading) return <div>Loading...</div>;
    return (
        <div className="mx-auto w-full max-w-3xl rounded-xl">
            <div className="flex justify-between items-center gap-2 sm:gap-4 ">
                {days.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div
                            className={`
                    w-10 h-10 sm:w-14 sm:h-14 
                    rounded-full 
                    border-2
                    flex flex-col items-center justify-center
                    transition-colors duration-200
                    ${getExerciseStatusForDay(day.name) ? "bg-green-500 border-green-500 text-white" : "border-gray-300 bg-white text-gray-600"}
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
            </div>
        </div>
    );
}

export default ShowWeek