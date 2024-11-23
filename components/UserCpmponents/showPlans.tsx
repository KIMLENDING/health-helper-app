'use client'
import { getExercisePlan, } from '@/server/queries';
import { useSession } from 'next-auth/react';
import React from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { BicepsFlexed, DumbbellIcon, RadicalIcon, SparklesIcon, VolleyballIcon } from 'lucide-react';
import Link from 'next/link';

const ShowPlans = () => {
    const { data: sessions } = useSession();
    const { data, error, isLoading } = getExercisePlan(sessions?.user._id); // 필요한 운동 계획 데이터를 가져옵니다.
    const Icons = [
        { name: 'BicepsFlexed', icon: <BicepsFlexed /> },
        { name: 'DumbbellIcon', icon: <DumbbellIcon /> },
        { name: 'SparklesIcon', icon: <SparklesIcon /> },
        { name: 'RadicalIcon', icon: <RadicalIcon /> },
        { name: 'VolleyballIcon', icon: <VolleyballIcon /> },
    ]
    if (isLoading) return <div>로딩중...</div>
    return (
        <div className='mx-auto w-full max-w-3xl rounded-xl'>
            <CardTitle className='my-3 font-extrabold text-2xl'>
                <Link href={'/dashboard/exercisePlans'}>
                    플랜 목록
                </Link>
            </CardTitle>
            {data ?
                <div className='grid gap-2 grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2 rounded-xl bg-muted/50 p-2'>{
                    data.map((plan) => {
                        const randomIndex = Math.floor(Math.random() * Icons.length);
                        const randomIcon = Icons[randomIndex]?.icon;
                        return (
                            <Card key={plan.title} className='aspect-auto '>
                                <CardHeader className='px-0'>
                                    <CardTitle className="text-xl px-6 cursor-pointer">
                                        <Link href={`dashboard/exerciseSession/${plan._id}`} className='flex flex-row gap-2'>
                                            {randomIcon}
                                            <div className='whitespace-nowrap overflow-hidden text-ellipsis w-32'> {plan.title}</div>
                                        </Link>
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        )
                    })
                }</div>
                : <div>운동 계획이 없습니다.</div>
            }
        </div>
    )
}

export default ShowPlans