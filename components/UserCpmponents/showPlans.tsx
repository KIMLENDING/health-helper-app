'use client'
import { getExercisePlan, } from '@/server/queries';
import { useSession } from 'next-auth/react';
import React from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { BicepsFlexed, DumbbellIcon, RadicalIcon, SparklesIcon, SquareArrowOutUpRightIcon, VolleyballIcon } from 'lucide-react';
import Link from 'next/link';
import LoadingSpinner from '../LayoutCompents/LoadingSpinner';

import { DrawerDialogDemo } from '../LayoutCompents/ResponsiveDialog';
import { useSessionContext } from '@/providers/SessionContext';

const ShowPlans = () => {
    const { session: serverSessions } = useSessionContext(); // 서버컴포넌트에서 받은 세션 데이터
    const { data: sessions } = useSession();
    const { data, isError, isLoading } = getExercisePlan(sessions?.user._id); // 필요한 운동 계획 데이터를 가져옵니다.

    const Icons = [
        { name: 'BicepsFlexed', icon: <BicepsFlexed className='text-green-400' /> },
        { name: 'DumbbellIcon', icon: <DumbbellIcon className='text-green-400' /> },
        { name: 'SparklesIcon', icon: <SparklesIcon className='text-green-400' /> },
        { name: 'RadicalIcon', icon: <RadicalIcon className='text-green-400' /> },
        { name: 'VolleyballIcon', icon: <VolleyballIcon className='text-green-400' /> },
    ]
    const columnCount = data && Math.min(data.length, 4);
    const columnCount2 = data && Math.min(data.length, 3);

    return (
        <div className='mx-auto w-full max-w-3xl rounded-xl'>
            <CardTitle className='my-3 font-extrabold text-2xl'>
                {sessions ?
                    <Link href={'/dashboard/exercisePlans'}>
                        <div className='flex flex-row gap-2 items-center hover:underline'>
                            플랜 목록
                            <SquareArrowOutUpRightIcon className='text-red-400' />
                        </div>
                    </Link> : <div className='flex flex-row gap-2 items-center hover:underline'>
                        플랜 목록
                        <SquareArrowOutUpRightIcon className='text-red-400' />
                    </div>}
            </CardTitle>
            <div className='rounded-xl bg-muted/50 p-2'>
                {!isLoading && !serverSessions ? <div className='text-center'>로그인이 필요합니다.</div> : <> {isLoading || !sessions ? <LoadingSpinner className="w-full flex justify-center items-center h-8 " /> : data ?
                    <div className={`grid gap-2 grid-cols-${columnCount} max-md:grid-cols-${columnCount2} max-sm:grid-cols-1 `}>{
                        data.map((plan) => {
                            const randomIndex = Math.floor(Math.random() * Icons.length);
                            const randomIcon = Icons[randomIndex]?.icon;
                            return (
                                <Card key={plan.title} className='aspect-auto '>
                                    <CardHeader className='px-0'>
                                        <CardTitle className="text-xl px-6 cursor-pointer hover:underline">
                                            <DrawerDialogDemo plan={plan}>
                                                {randomIcon}
                                                <div className='whitespace-nowrap overflow-hidden text-ellipsis w-32'> {plan.title}</div>
                                            </DrawerDialogDemo>
                                        </CardTitle>
                                    </CardHeader>
                                </Card>
                            )
                        })
                    }</div>
                    : <div>운동 계획이 없습니다.</div>
                }</>}

                <div>{isError && '새로고침해 보세요'}</div>
            </div>
        </div>
    )
}

export default ShowPlans