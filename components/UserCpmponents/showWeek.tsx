'use client';

import React from 'react'
import LoadingSpinner from '../LayoutCompents/LoadingSpinner';
import { Card, CardTitle } from '../ui/card';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface ShowWeekProps {
    data: any; // message, session:ExerciseSession[]
    isLoading: boolean;
    isError: boolean;
}

const ShowWeek = ({ data, isLoading, isError }: ShowWeekProps) => {
    console.log(data)
    const { data: sessions } = useSession();
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
    // 일주일 요일 배열 생성성
    const weekDates = getCurrentWeekDates();
    const days = weekDates.map((date, index) => ({
        label: ["일", "월", "화", "수", "목", "금", "토"][index],
        name: date.toLocaleString("ko-KR", {
            weekday: "long",
        }),
        date: date,

    }));


    // 해당 요일에 운동 기록이 있는지 확인 및 id값 추가
    const a = days.map((day) => {
        const matchedSession = data?.sessions.find((session: any) => {
            const sessionDate = new Date(session.createdAt).toLocaleDateString("ko-KR");
            const dayDate = day.date.toLocaleDateString("ko-KR");
            return sessionDate === dayDate;
        });

        return {
            ...day,
            status: !!matchedSession, // 매칭된 session이 있으면 true, 없으면 false
            id: matchedSession?._id || '', // 매칭된 session의 id, 없으면 빈 문자열
        };
    });


    return (
        <section className="mx-auto w-full max-w-3xl rounded-xl ">
            <CardTitle className='my-3 font-extrabold text-2xl'>

                <div className='flex flex-row gap-2 items-center hover:underline'>
                    주간 히스토리
                </div>

            </CardTitle>
            <div className=' bg-muted/50 p-2 rounded-xl'>
                {isLoading ? <div className='w-full flex justify-center items-center h-8'><LoadingSpinner /></div> :
                    <Card className="aspect-auto flex justify-between items-center gap-2 sm:gap-4 p-4">
                        {a.map((day, index) => (
                            <div key={index} className="flex flex-col items-center">

                                <div
                                    className={`
                    w-8 h-8 sm:w-14 sm:h-14 
                    rounded-full 
                    border-2
                    flex flex-col items-center justify-center
                    transition-colors duration-200
                    ${day.status ? "bg-green-500 border-green-700 text-white" : "border-gray-300 bg-white text-gray-600"}
                    `}
                                    role="status"
                                    aria-label={`Exercise status for ${day.name}`}
                                >
                                    {day.id ? <Link href={`/dashboard/detail/${day.id}`}>
                                        <span className="text-sm sm:text-base font-semibold">
                                            {day.date.getDate()}
                                        </span>
                                    </Link> : <span className="text-sm sm:text-base font-semibold">
                                        {day.date.getDate()}
                                    </span>}
                                </div>

                                <span className="mt-2 text-sm sm:text-base font-semibold ">
                                    {day.label}
                                </span>
                            </div>
                        ))}
                    </Card>
                }
            </div>
            <div>
                {!sessions && '로그인 해주세요'}
                {sessions && isError && '새로고침해 보세요'}
            </div>
        </section>
    );
}

export default ShowWeek