'use client';
import LoadingBubbles from '@/components/LayoutCompents/Loading/LoadingBubbles';

import TotalTitleBySession from '@/components/UserCpmponents/chartComponents/session/totalTitleBySession';
import TotalTitleByWeight from '@/components/UserCpmponents/chartComponents/session/totalTitleByWeight';
import { useGetExerciseSession } from '@/server/user/exerciseSession/queries';

import { useParams } from 'next/navigation';
import React from 'react'

const Page = () => {
    const params = useParams();
    const { data, isLoading, isError } = useGetExerciseSession(params.sessionId as string);
    if (isLoading) return <div className='w-full h-full flex items-center justify-center '><LoadingBubbles /></div>;
    if (isError) return <div>Error loading data</div>;
    return (
        <div className='p-2 '>

            <div className="space-y-6">
                <TotalTitleByWeight data={data} />
                <TotalTitleBySession data={data} />
            </div>
        </div>
    )
}

export default Page