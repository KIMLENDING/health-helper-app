'use client';
import LoadingSpinner from '@/components/LayoutCompents/LoadingSpinner';
import { Component } from '@/components/UserCpmponents/chartComponents/session/testChart';
import TotalTitleBySession from '@/components/UserCpmponents/chartComponents/session/totalTitleBySession';
import TotalTitleByWeight from '@/components/UserCpmponents/chartComponents/session/totalTitleByWeight';
import { useGetExerciseSession } from '@/server/queries';
import { useParams } from 'next/navigation';
import React from 'react'




const Page = () => {
    const params = useParams();
    const { data, isLoading, isError } = useGetExerciseSession(params.sessionId as string);


    if (isLoading) return <LoadingSpinner />;
    return (
        <div>
            운동 분석 페이지 입니다.
            <TotalTitleByWeight data={data} />
            <TotalTitleBySession data={data} />
        </div >
    )
}

export default Page