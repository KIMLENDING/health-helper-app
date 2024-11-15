'use client'
import { getExercisePlan } from '@/server/queries';
import { useSession } from 'next-auth/react';
import React from 'react'

const ShowExercisePlan = () => {
    const { data: sessions } = useSession();
    const { data, error, isLoading } = getExercisePlan(sessions?.user._id); // 필요한 운동 계획 데이터를 가져옵니다.
    if (isLoading) return <div>로딩중...</div>
    console.log(data)
    return (
        <div>

            {data
                ? <div>ss</div>
                : <div>운동 계획이 없습니다.</div>
            }
        </div>
    )
}

export default ShowExercisePlan