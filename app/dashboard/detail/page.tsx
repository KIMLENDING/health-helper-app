'use client';
import { useAllSessions } from "@/server/queries";
import { ExerciseSession } from "@/utils/util";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import TotalTitleBySession from "@/components/UserCpmponents/chartComponents/session/totalTitleBySession";
import { useEffect, useState } from "react";
import TotalTitleByWeight from "@/components/UserCpmponents/chartComponents/session/totalTitleByWeight";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const Page = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useAllSessions(year, month, page, 5);

    // 월, 연도 변경 시 첫 페이지로 초기화
    useEffect(() => {
        setPage(1);
    }, [year, month]);

    if (isError) return (
        <div className="flex justify-center items-center h-64">
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg shadow-sm">
                <p className="font-medium flex items-center">
                    <span className="mr-2">⚠️</span>
                    데이터를 불러오는 중 오류가 발생했습니다.
                </p>
                <p className="text-sm mt-1 text-red-500">잠시 후 다시 시도해 주세요.</p>
            </div>
        </div>
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayOfWeek = dayNames[date.getDay()];

        return {
            formatted: dateString.split('T')[0].replaceAll('-', '.'),
            dayOfWeek
        };
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl shadow-lg mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">운동 기록</h1>
                <p className="text-blue-100">나의 운동 여정을 한눈에 확인하세요</p>
            </div>

            {/* 🔹 연도 & 월 선택 */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <h2 className="font-semibold text-lg">기간 선택</h2>
                    </div>

                    <div className="flex gap-3">
                        <select
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {[2023, 2024, 2025].map((y) => (
                                <option key={y} value={y}>{y}년</option>
                            ))}
                        </select>
                        <select
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                            className="bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                <option key={m} value={m}>{m}월</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* 🔹 운동 기록 (로딩 중이면 스켈레톤 UI) */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((index) => (
                        <div key={index} className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-md">
                            <div className="h-16 bg-gray-200 dark:bg-zinc-700 animate-pulse" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 dark:bg-zinc-700 animate-pulse rounded-full w-2/3" />
                                <div className="h-4 bg-gray-200 dark:bg-zinc-700 animate-pulse rounded-full w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : data?.allSession?.length > 0 ? (
                <Accordion type="multiple" className="space-y-4">
                    {data?.allSession.map((session: ExerciseSession) => {
                        const { formatted, dayOfWeek } = formatDate(session.createdAt || '');

                        return (
                            <AccordionItem
                                value={`${session._id}`}
                                key={session._id}
                                className="border-0 rounded-xl overflow-hidden bg-white dark:bg-zinc-800 shadow-md transition-all hover:shadow-lg"
                            >
                                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                                    <div className="flex items-center justify-between w-full">
                                        <div>
                                            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                                {formatted} <span className="text-blue-500">({dayOfWeek})</span>
                                            </p>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                                {session.exercises.length}개 운동 기록
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                                            자세히 보기
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 pt-2">
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-lg">
                                            <h3 className="text-sm uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">운동 무게별 분석</h3>
                                            <TotalTitleByWeight data={session} />
                                        </div>
                                        <div className="bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-lg">
                                            <h3 className="text-sm uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">세션별 분석</h3>
                                            <TotalTitleBySession data={session} />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            ) : (
                <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 shadow-md text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-zinc-700 rounded-full mb-4">
                        <Calendar className="h-8 w-8 text-gray-400 dark:text-zinc-500" />
                    </div>
                    <p className="text-lg font-medium text-gray-600 dark:text-zinc-300">운동 기록이 없습니다.</p>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                        이 기간에 기록된 운동 데이터가 없어요.
                    </p>
                </div>
            )}

            {/* 🔹 페이지네이션 (로딩 중이면 버튼 비활성화) */}
            {data?.allSession?.length > 0 && (
                <div className="flex justify-between items-center mt-8 bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-md">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1 || isLoading}
                        className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${page === 1 || isLoading
                            ? 'bg-gray-100 dark:bg-zinc-700 text-gray-400 dark:text-zinc-500 cursor-not-allowed'
                            : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/40'
                            }`}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span>이전</span>
                    </button>

                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-blue-600 dark:text-blue-300">{page}</span>
                        <span className="text-gray-400 dark:text-zinc-500">/ {data?.totalPages ?? 1}</span>
                    </div>

                    <button
                        onClick={() => setPage((prev) => (prev < (data?.totalPages ?? 1) ? prev + 1 : prev))}
                        disabled={page >= (data?.totalPages ?? 1) || isLoading}
                        className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${page >= (data?.totalPages ?? 1) || isLoading
                            ? 'bg-gray-100 dark:bg-zinc-700 text-gray-400 dark:text-zinc-500 cursor-not-allowed'
                            : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/40'
                            }`}
                    >
                        <span>다음</span>
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Page;