'use client'
import { getSpecificExercisePlan } from '@/server/queries';
import { useParams } from 'next/navigation'
import React from 'react'

const Page = () => {
    const { exercisePlanId } = useParams();
    if (typeof exercisePlanId !== 'string') {
        return <div>유효하지 않은 세션 ID</div>;
    }
    const { data, error, isLoading } = getSpecificExercisePlan(exercisePlanId);
    console.log(exercisePlanId)
    if (isLoading) return <div>로딩중...</div>
    if (error) return <div>에러 발생</div>

    return (
        <div>
            시작 버튼을 누르면 3초 후 카운트 다운을 하고 타이머가 시작
            타이머는 일시정지 , 종료 버튼이 있음
            {data?.title}
            <div>
                {data?.exercises.map((exercise) => {
                    return (
                        <div key={exercise._id}>
                            {exercise.title}
                            {Array.from({ length: exercise.sets }).map((_, index) => (
                                <div key={index} className='flex flex-row gap-4'>
                                    <div>
                                        {exercise.reps}회
                                    </div>
                                    <div>
                                        {exercise.rest}초 휴식
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Page