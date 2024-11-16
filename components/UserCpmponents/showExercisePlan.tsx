'use client'
import { getExercisePlan, } from '@/server/queries';
import { useSession } from 'next-auth/react';
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ClockIcon, DumbbellIcon } from 'lucide-react';
import ExercisesWithPagination from './exercisesWithPagination';

const ShowExercisePlan = () => {
    const { data: sessions } = useSession();
    const { data, error, isLoading } = getExercisePlan(sessions?.user._id); // 필요한 운동 계획 데이터를 가져옵니다.

    console.log(data)

    if (isLoading) return <div>로딩중...</div>
    return (
        <div className='mx-auto w-full max-w-3xl rounded-xl'>
            {data
                ? <div className='space-y-4'>{
                    data.map((plan) => (
                        <Card key={plan.title} >

                            <CardHeader className='px-0'>
                                <CardTitle className="text-xl px-6">{plan.title}</CardTitle>
                                <ExercisesWithPagination plan={plan} />
                            </CardHeader>
                        </Card>
                    ))

                }</div>
                : <div>운동 계획이 없습니다.</div>
            }
        </div>
    )
}

export default ShowExercisePlan