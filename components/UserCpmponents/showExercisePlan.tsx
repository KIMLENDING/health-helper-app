'use client'
import { getExercisePlan, useEexercises } from '@/server/queries';
import { Exercise, ExerciseOption } from '@/utils/util';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '../ui/card';



interface ExerciseOptionWithTitle extends ExerciseOption {
    title: string;
}
const ShowExercisePlan = () => {
    const { data: sessions } = useSession();
    const { data, error, isLoading } = getExercisePlan(sessions?.user._id); // 필요한 운동 계획 데이터를 가져옵니다.
    const { data: exercises, error: error2, isLoading: isLoading2 } = useEexercises();
    console.log(data)
    console.log(exercises)
    useEffect(() => {
        if (!data || !exercises) return
        data?.map((plan) => {
            plan.exercises = plan.exercises.map((exercise) => {
                const title = exercises?.find((v: Exercise) => v._id === exercise.exerciseId).title
                return { ...exercise, title }
            })
        })
        console.log(data)
    }, [data, exercises])
    if (isLoading || isLoading2) return <div>로딩중...</div>
    return (
        <div>

            {data
                ? <div>{
                    data.map((plan) => (
                        <Card key={plan.title}>
                            <CardHeader>{plan.title}</CardHeader>

                            <CardContent>
                                {plan.exercises.map((exercise) => (
                                    <li key={exercise.exerciseId}>
                                        {(exercise as ExerciseOptionWithTitle).title}
                                    </li>
                                ))}
                            </CardContent>
                        </Card>
                    ))

                }</div>
                : <div>운동 계획이 없습니다.</div>
            }
        </div>
    )
}

export default ShowExercisePlan