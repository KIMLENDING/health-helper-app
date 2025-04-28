'use client';
import LoadingSpinner from '@/components/LayoutCompents/LoadingSpinner';
import TotalTitleBySession from '@/components/UserCpmponents/chartComponents/session/totalTitleBySession';
import TotalTitleByWeight from '@/components/UserCpmponents/chartComponents/session/totalTitleByWeight';
import { useGetExerciseSession } from '@/server/queries';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Page = () => {
    const params = useParams();
    const { data, isLoading, isError } = useGetExerciseSession(params.sessionId as string);
    if (isLoading) return <div className='w-full h-full flex items-center justify-center '><LoadingSpinner className='w-[5vh] h-[5vh]' /></div>;
    if (isError) return <div>Error loading data</div>;
    return (
        <div className='px-4'>

            <div className="space-y-6">
                <TotalTitleByWeight data={data} />
                <TotalTitleBySession data={data} />
            </div>
        </div>
    )
}

export default Page