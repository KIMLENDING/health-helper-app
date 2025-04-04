'use client'
import { useExercisePlan, } from '@/server/queries';
import { useSession } from 'next-auth/react';
import React from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { BicepsFlexed, DumbbellIcon, RadicalIcon, SparklesIcon, SquareArrowOutUpRightIcon, VolleyballIcon } from 'lucide-react';
import Link from 'next/link';
import { DrawerDialogDemo } from '../LayoutCompents/ResponsiveDialog';


const ShowPlans = () => {
    const { data: sessions } = useSession();
    const { data, isError, isLoading } = useExercisePlan(); // 필요한 운동 계획 데이터를 가져옵니다.

    const Icons = [
        { name: 'BicepsFlexed', icon: <BicepsFlexed className='text-green-400' /> },
        { name: 'DumbbellIcon', icon: <DumbbellIcon className='text-green-400' /> },
        { name: 'SparklesIcon', icon: <SparklesIcon className='text-green-400' /> },
        { name: 'RadicalIcon', icon: <RadicalIcon className='text-green-400' /> },
        { name: 'VolleyballIcon', icon: <VolleyballIcon className='text-green-400' /> },
    ]

    return (
        <div className='mx-auto w-full max-w-3xl rounded-xl select-none'>
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
            {/** 플랜 내용 표시 */}
            <div className='rounded-xl bg-muted/50 p-2 h-72 overflow-y-scroll '>
                {isLoading ? (
                    <div className="flex flex-col gap-2">
                        {[1, 2, 3].map((index) => (
                            <div key={index} className="h-16 bg-gray-200 dark:bg-zinc-700 animate-pulse rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <>
                        {data && data.length > 0 ? (
                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-2`}>
                                {data.map((plan) => {

                                    const randomIcon = Icons[1].icon;
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
                                }
                                )}
                            </div>) : <div>운동 계획이 없습니다.</div>}
                    </>
                )}
                <div>{isError && '새로고침해 보세요'}</div>
            </div>
        </div>
    )
}

export default ShowPlans