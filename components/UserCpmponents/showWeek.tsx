'use client';

import React from 'react';
import { Card, CardTitle, CardContent } from '../ui/card';
import Link from 'next/link';
import { useWeekSessions } from '@/server/queries';
import { Calendar, ChevronRight, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import AsyncStateWrapper from '@/components/LayoutCompents/AsyncStateWrapper';

// ─── 타입 정의 ────────────────────────────────────────────────────────────────
type WeekDay = {
    label: string;
    name: string;
    date: Date;
    status: boolean;
    id: string;
    isToday: boolean;
};

// ─── DayCell 서브컴포넌트 ────────────────────────────────────────────────────
/**
 * 주간 캘린더의 요일 하나를 렌더링합니다.
 * 운동 기록(id)이 있으면 Link로, 없으면 일반 div로 렌더링합니다.
 */
const DayCell = ({ day }: { day: WeekDay }) => {
    const circleClass = cn(
        'w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300',
        day.status
            ? 'bg-green-500 text-white shadow-md hover:bg-green-600'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
        day.isToday && 'border-2 border-blue-500 dark:border-blue-400',
    );

    const labelClass = cn(
        'mt-2 text-xs sm:text-sm font-medium text-center block',
        day.status ? 'text-green-600 dark:text-green-500' : 'text-gray-600 dark:text-gray-400',
        day.isToday && 'font-bold',
    );

    const content = (
        <>
            <div className={circleClass}>
                <span className="text-sm sm:text-base font-bold">{day.date.getDate()}</span>
            </div>
            <span className={labelClass}>{day.label}</span>
        </>
    );

    if (day.id) {
        return (
            <Link href={`/dashboard/detail/${day.id}`} className="flex flex-col items-center">
                {content}
            </Link>
        );
    }

    return <div className="flex flex-col items-center">{content}</div>;
};

// ─── ShowWeek 메인 컴포넌트 ──────────────────────────────────────────────────
const ShowWeek = () => {
    const { data, isError, isLoading } = useWeekSessions();

    const getCurrentWeekDates = () => {
        const today = new Date();
        const sunday = new Date(today);
        sunday.setDate(sunday.getDate() - sunday.getDay());
        return Array(7)
            .fill(null)
            .map((_, i) => {
                const date = new Date(sunday);
                date.setDate(sunday.getDate() + i);
                return date;
            });
    };

    const weekDates = getCurrentWeekDates();
    const today = new Date();
    const isToday = (date: Date) =>
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    const days = weekDates.map((date, index) => ({
        label: ['일', '월', '화', '수', '목', '금', '토'][index],
        name: date.toLocaleString('ko-KR', { weekday: 'long' }),
        date,
    }));

    // 해당 요일에 운동 기록이 있는지 확인 및 id 값 추가
    const weekSessionMapping: WeekDay[] = days.map((day) => {
        const matchedSession = data?.sessions.find((session: any) => {
            const sessionDate = new Date(session.createdAt).toLocaleDateString('ko-KR');
            const dayDate = day.date.toLocaleDateString('ko-KR');
            return sessionDate === dayDate;
        });
        return {
            ...day,
            status: !!matchedSession,
            id: matchedSession?._id || '',
            isToday: isToday(day.date),
        };
    });

    // 이번 주 완료된 운동 세션 수 계산
    const completedSessions = weekSessionMapping.filter((d) => d.status).length;
    const completionRate = Math.round((completedSessions / 7) * 100);

    return (
        <section className="mx-auto w-full max-w-4xl space-y-4">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-green-600" />
                    <CardTitle className="font-extrabold text-2xl">주간 히스토리</CardTitle>
                </div>
                <Link
                    href="/dashboard/detail"
                    className="flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
                >
                    전체보기
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
            </div>

            <AsyncStateWrapper
                isLoading={isLoading}
                isError={isError}
                data={data}
                loadingSkeleton={
                    <Card className="p-6 animate-pulse">
                        <div className="flex justify-between items-center">
                            {[...Array(7)].map((_, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                                    <div className="mt-2 w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                                </div>
                            ))}
                        </div>
                    </Card>
                }
                errorMessage="운동 기록을 가져오는 데 실패했습니다. 다시 시도해주세요."
            >
                {() => (
                    <>
                        {/* 주간 진행률 바 */}
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

                        {/* 주간 달력 */}
                        <Card className="overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center">
                                    {weekSessionMapping.map((day, i) => (
                                        <DayCell key={i} day={day} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </AsyncStateWrapper>
        </section>
    );
};

export default ShowWeek;