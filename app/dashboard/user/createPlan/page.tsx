
'use client'
import GetExercise from '@/components/AdminComponents/getExercise'
import { getSelectedExercises } from '@/server/queries'
import React from 'react'

const CreatPlan = () => {
    const { data, isLoading, status } = getSelectedExercises();
    console.log(data)
    return (
        <div className='flex flex-1 flex-col gap-4 p-4'>
            <GetExercise />
            <div className="mx-auto  min-h-min w-full max-w-3xl rounded-xl bg-muted/50" >
                ㅇ
            </div>
        </div>
    )
}

export default CreatPlan