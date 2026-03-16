'use client';

import { useParams, useRouter } from 'next/navigation';
import { TotalTitleBySession, TotalTitleByWeight } from '@/components/UserCpmponents/DynamicComponents';
import { useGetExerciseSession } from '@/server/user/exerciseSession/queries';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react'
import LoadingOverlay from '@/components/LayoutCompents/LoadingOverlay';

const Page = () => {
    const params = useParams();
    const router = useRouter();
    const { data, isLoading, isError } = useGetExerciseSession(params.sessionId as string);
    if (isLoading) return <div className='w-full h-full flex items-center justify-center '>
        <LoadingOverlay isLoading={isLoading} text="세션 정보를 가져오는 중..." />
    </div>;
    if (isError) return <div>Error loading data</div>;
    const formattedDate = data?.createdAt
        ? new Date(data.createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short'
        }) : '세션 상세 정보';

    return (
        <div className=' p-2 '>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl shadow-lg mb-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/30 hover:text-white"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">세션 상세 기록</h1>
                        <p className="text-blue-100 break-keep">해당 운동 세션의 세부 분석을 확인하세요.</p>
                    </div>
                </div>
            </div>


            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md border border-zinc-100 dark:border-zinc-700 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-1.5 rounded-lg">
                                📅
                            </span>
                            {formattedDate}
                        </h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 ml-9">
                            이번 세션에서는 총 <strong className="text-blue-500">{data?.exercises?.length || 0}</strong>개의 운동을 진행하셨네요!
                        </p>
                    </div>
                </div>

                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 sm:p-6 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <TotalTitleByWeight data={data!} />
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 sm:p-6 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <TotalTitleBySession data={data!} />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Page