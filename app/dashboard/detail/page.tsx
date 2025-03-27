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

const Page = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useAllSessions(year, month, page, 5);

    // 운동 세션 데이터 필터링 (빈 세션 제거)
    const filteredSessions = data?.allSession?.map((sessionData: ExerciseSession) => ({
        ...sessionData,
        exercises: sessionData.exercises.filter(exercise => exercise.session.length > 0),
    }));

    // 월, 연도 변경 시 첫 페이지로 초기화
    useEffect(() => {
        setPage(1);
    }, [year, month]);

    if (isError) return <div className="text-red-500 text-center">데이터를 불러오는 중 오류가 발생했습니다.</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">운동 기록</h1>

            {/* 🔹 연도 & 월 선택 */}
            <div className="flex gap-2 my-4">
                <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                    {[2023, 2024, 2025].map((y) => (
                        <option key={y} value={y}>{y}년</option>
                    ))}
                </select>
                <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>{m}월</option>
                    ))}
                </select>
            </div>

            {/* 🔹 운동 기록 (로딩 중이면 스켈레톤 UI) */}
            <Accordion type="multiple">
                {isLoading ? (
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map((index) => (
                            <div key={index} className="h-16 bg-gray-200 dark:bg-zinc-700 animate-pulse rounded-lg" />
                        ))}
                    </div>
                ) : (
                    filteredSessions?.length > 0 ? (
                        filteredSessions.map((session: ExerciseSession) => (
                            <AccordionItem value={`${session._id}`} key={session._id} className="border-0">
                                <div className="mb-4 p-4 py-2 border rounded-lg shadow-md bg-white dark:bg-zinc-800">
                                    <AccordionTrigger className="text-2xl font-semibold py-2 text-zinc-900 dark:text-zinc-100">
                                        {session.createdAt?.split('T')[0].replaceAll('-', ' / ')}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <TotalTitleByWeight data={session} />
                                        <TotalTitleBySession data={session} />
                                    </AccordionContent>
                                </div>
                            </AccordionItem>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">운동 기록이 없습니다.</p>
                    )
                )}
            </Accordion>

            {/* 🔹 페이지네이션 (로딩 중이면 버튼 비활성화) */}
            <div className="flex justify-between my-4">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1 || isLoading}
                    className={`px-4 py-2 rounded ${page === 1 || isLoading ? 'bg-gray-400' : 'bg-gray-300 hover:bg-gray-400'}`}
                >
                    이전
                </button>
                <p> {page} / {data?.totalPages ?? 1}</p>
                <button
                    onClick={() => setPage((prev) => (prev < (data?.totalPages ?? 1) ? prev + 1 : prev))}
                    disabled={page >= (data?.totalPages ?? 1) || isLoading}
                    className={`px-4 py-2 rounded ${page >= (data?.totalPages ?? 1) || isLoading ? 'bg-gray-400' : 'bg-gray-300 hover:bg-gray-400'}`}
                >
                    다음
                </button>
            </div>

        </div>
    );
};

export default Page;
