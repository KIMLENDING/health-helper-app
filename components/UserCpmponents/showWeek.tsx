'use client';

import React from 'react'
import { Card, CardTitle } from '../ui/card';
import Link from 'next/link';
import { useWeekSessions } from '@/server/queries';

const ShowWeek = () => {
    const { data, isError } = useWeekSessions(); // 필요한 운동 계획 데이터를 가져옵니다.
    const getCurrentWeekDates = () => {
        // 오늘 날짜를 기준으로 이번주 일요일부터 토요일까지의 날짜를 배열로 반환
        const today = new Date();
        const monday = new Date(today);
        console.log(monday.getDate(), monday.getDay())
        monday.setDate(monday.getDate() - monday.getDay() + 1); // 월요일 날짜 구하기
        return Array(7)
            .fill(null)
            .map((_, i) => {
                const date = new Date(monday);
                date.setDate(monday.getDate() + i);
                return date;
            });
    };
    // 일주일 요일 배열 생성성
    const weekDates = getCurrentWeekDates();
    const days = weekDates.map((date, index) => ({
        label: ["월", "화", "수", "목", "금", "토", '일'][index],
        name: date.toLocaleString("ko-KR", {
            weekday: "long",
        }),
        date: date,
    }));


    // 해당 요일에 운동 기록이 있는지 확인 및 id값 추가
    const weekSessionMapping = days.map((day) => {
        const matchedSession = data?.sessions.find((session: any) => {
            // 같은 날이 2개 이상일 경우, 가장 최근의 session을 가져오기 위해 createdAt을 사용하여 비교
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
                <Link href={'/dashboard/detail'} className='flex flex-row gap-2 items-center hover:underline select-none'>
                    주간 히스토리
                </Link>
            </CardTitle>
            <div className=' bg-muted/50 p-2 rounded-xl '>
                <Card className="aspect-auto flex justify-between items-center gap-2 sm:gap-4 p-4 select-none ">
                    {weekSessionMapping.map((day, index) => (
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
                                {day.id ?
                                    <span className="text-sm sm:text-base font-semibold">
                                        <Link href={`/dashboard/detail/${day.id}`}>
                                            {day.date.getDate()}
                                        </Link>
                                    </span>
                                    :
                                    <span className="text-sm sm:text-base font-semibold">
                                        {day.date.getDate()}
                                    </span>}
                            </div>
                            {day.id ?
                                <span className="mt-2 text-sm sm:text-base font-semibold  ">
                                    <Link href={`/dashboard/detail/${day.id}`}>
                                        {day.label}
                                    </Link>
                                </span>
                                :
                                <span className="mt-2 text-sm sm:text-base font-semibold  ">
                                    {day.label}
                                </span>}

                        </div>
                    ))}
                </Card>
            </div>
            {isError && (
                <div className="mt-4 text-red-500">
                    운동 기록을 가져오는 데 실패했습니다. 다시 시도해주세요.
                </div>
            )}
        </section>
    );
}

export default ShowWeek