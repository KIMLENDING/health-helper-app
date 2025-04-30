'use client';

import React from 'react';
import { Card, CardTitle, CardContent } from '../ui/card';
import Link from 'next/link';
import { useWeekSessions } from '@/server/queries';
import { Calendar, ChevronRight, Activity, AlertCircle } from 'lucide-react';

const ShowWeek = () => {
    const { data, isError, isLoading } = useWeekSessions();

    const getCurrentWeekDates = () => {
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

    // 일주일 요일 배열 생성
    const weekDates = getCurrentWeekDates();
    const days = weekDates.map((date, index) => ({
        label: ['일', "월", "화", "수", "목", "금", "토",][index],
        name: date.toLocaleString("ko-KR", {
            weekday: "long",
        }),
        date: date,
    }));

    // 오늘 날짜 확인
    const today = new Date();
    const isToday = (date: any) => {
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    // 해당 요일에 운동 기록이 있는지 확인 및 id값 추가
    const weekSessionMapping = days.map((day) => {
        const matchedSession = data?.sessions.find((session: any) => {
            const sessionDate = new Date(session.createdAt).toLocaleDateString("ko-KR");
            const dayDate = day.date.toLocaleDateString("ko-KR");
            return sessionDate === dayDate;
        });

        return {
            ...day,
            status: !!matchedSession, // 매칭된 session이 있으면 true, 없으면 false
            id: matchedSession?._id || '', // 매칭된 session의 id, 없으면 빈 문자열
            isToday: isToday(day.date),
        };
    });

    // 이번 주 완료된 운동 세션 수 계산
    const completedSessions = weekSessionMapping.filter(day => day.status).length;
    const completionRate = Math.round((completedSessions / 7) * 100);

    return (
        <section className="mx-auto w-full max-w-4xl px-4   space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-green-600" />
                    <CardTitle className='font-extrabold text-2xl'>
                        주간 히스토리
                    </CardTitle>
                </div>
                <Link
                    href={'/dashboard/detail'}
                    className='flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors'
                >
                    전체보기
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
            </div>

            {isLoading ? (
                <Card className="p-6 animate-pulse">
                    <div className="flex justify-between items-center">
                        {[...Array(7)].map((_, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                <div className="mt-2 w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                        ))}
                    </div>
                </Card>
            ) : (
                <>
                    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="mb-4 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-green-600" />
                                    <span className="font-medium">이번 주 진행률</span>
                                </div>
                                <span className="text-green-600 font-bold">{completionRate}%</span>
                            </div>

                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div
                                    className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${completionRate}%` }}
                                />
                            </div>

                            <div className="mt-1 text-xs text-gray-500 text-right">
                                {completedSessions}/7일 완료
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center">
                                {weekSessionMapping.map((day, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                        {day.id ? (
                                            <Link
                                                href={`/dashboard/detail/${day.id}`}
                                                className="w-full"
                                            >
                                                <div className={`
                                                    w-10 h-10 sm:w-14 sm:h-14 
                                                    rounded-full 
                                                    flex items-center justify-center
                                                    transition-all duration-300
                                                    ${day.status
                                                        ? "bg-green-500 text-white shadow-md hover:bg-green-600"
                                                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"}
                                                    ${day.isToday
                                                        ? "border-2 border-blue-500 dark:border-blue-400"
                                                        : ""}
                                                `}>
                                                    <span className="text-sm sm:text-base font-bold">
                                                        {day.date.getDate()}
                                                    </span>
                                                </div>
                                                <span className={`
                                                    mt-2 text-xs sm:text-sm font-medium text-center block
                                                    ${day.status
                                                        ? "text-green-600 dark:text-green-500"
                                                        : "text-gray-600 dark:text-gray-400"}
                                                    ${day.isToday
                                                        ? "font-bold"
                                                        : ""}
                                                `}>
                                                    {day.label}
                                                </span>
                                            </Link>
                                        ) : (
                                            <>
                                                <div className={`
                                                    w-10 h-10 sm:w-14 sm:h-14 
                                                    rounded-full
                                                    flex items-center justify-center
                                                    ${day.isToday
                                                        ? "border-2 border-blue-500 bg-gray-50 dark:bg-gray-900"
                                                        : "bg-gray-100 dark:bg-gray-800"}
                                                    text-gray-700 dark:text-gray-300
                                                `}>
                                                    <span className="text-sm sm:text-base font-bold">
                                                        {day.date.getDate()}
                                                    </span>
                                                </div>
                                                <span className={`
                                                    mt-2 text-xs sm:text-sm font-medium text-center block
                                                    text-gray-600 dark:text-gray-400
                                                    ${day.isToday ? "font-bold" : ""}
                                                `}>
                                                    {day.label}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            {isError && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>운동 기록을 가져오는 데 실패했습니다. 다시 시도해주세요.</span>
                </div>
            )}
        </section>
    );
};

export default ShowWeek;