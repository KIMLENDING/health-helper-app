'use client'
import { getExercisePlan, } from '@/server/queries';
import { useSession } from 'next-auth/react';
import React from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { BicepsFlexed, DumbbellIcon, RadicalIcon, SparklesIcon, VolleyballIcon } from 'lucide-react';
import Link from 'next/link';
import LoadingSpinner from '../LayoutCompents/LoadingSpinner';
import { Button } from '../ui/button';
import { ExercisePlan } from '@/utils/util';
import { useCreateExerciseSession } from '@/server/mutations';
import { useRouter } from 'next/navigation';

const ShowPlans = () => {
    const { data: sessions } = useSession();
    const router = useRouter();
    const useCreateSessionMutation = useCreateExerciseSession();
    const { data, error, isLoading } = getExercisePlan(sessions?.user._id); // 필요한 운동 계획 데이터를 가져옵니다.
    const Icons = [
        { name: 'BicepsFlexed', icon: <BicepsFlexed /> },
        { name: 'DumbbellIcon', icon: <DumbbellIcon /> },
        { name: 'SparklesIcon', icon: <SparklesIcon /> },
        { name: 'RadicalIcon', icon: <RadicalIcon /> },
        { name: 'VolleyballIcon', icon: <VolleyballIcon /> },
    ]

    const handleMutation = async (plan: ExercisePlan) => {
        // api 호출을 통해 세션을 생성하고 생성이 되면 세션의 id를 반환 받아서 페이지 이동
        const { exercises, _id, userId, ...rest } = plan as any;
        if (!sessions) return;
        const newSession = { // 세션 생성
            userId: sessions?.user._id,
            exercisePlanId: _id,
            state: 'pending',
            exercises: exercises.map((exercise: { _id: string;[key: string]: any }) => {
                const { _id, ...rest } = exercise;
                return { ...rest, state: 'pending' };
            }),
        }
        const res = await useCreateSessionMutation.mutateAsync(newSession);

        if (res) {
            router.push(`/dashboard/exerciseSession/${res.newExerciseSession._id}`); // 세션 생성 후 세션 페이지로 이동
        }
    }

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
                                        <Button onClick={() => handleMutation(plan)} className='flex flex-row gap-2'>
                                            생성
                                        </Button>
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
                : isLoading ? <LoadingSpinner className="w-8 h-8 " /> : <div>운동 계획이 없습니다.</div>
            }
        </div>
    )
}

export default ShowPlans