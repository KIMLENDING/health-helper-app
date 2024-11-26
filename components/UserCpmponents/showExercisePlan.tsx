'use client'
import { getExercisePlan, } from '@/server/queries';
import { useSession } from 'next-auth/react';
import React from 'react'
import { Card, CardHeader, CardTitle } from '../ui/card';
import ExercisesWithPagination from './exercisesWithPagination';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { BicepsFlexed, DumbbellIcon, PencilIcon, RadicalIcon, SparklesIcon, Trash2Icon, VolleyballIcon } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import LoadingSpinner from '../LayoutCompents/LoadingSpinner';

const ShowExercisePlan = () => {
    const { data: sessions } = useSession();
    const { data, error, isLoading } = getExercisePlan(sessions?.user._id); // 필요한 운동 계획 데이터를 가져옵니다.

    const Icons = [
        { name: 'BicepsFlexed', icon: <BicepsFlexed /> },
        { name: 'DumbbellIcon', icon: <DumbbellIcon /> },
        { name: 'SparklesIcon', icon: <SparklesIcon /> },
        { name: 'RadicalIcon', icon: <RadicalIcon /> },
        { name: 'VolleyballIcon', icon: <VolleyballIcon /> },
    ]

    if (isLoading) return <LoadingSpinner />
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
                                    <Dialog >
                                        <DialogTrigger asChild>
                                            <CardTitle className="text-xl px-6 cursor-pointer">
                                                <div className='flex flex-row gap-2'>
                                                    {randomIcon}
                                                    <div className='whitespace-nowrap overflow-hidden text-ellipsis w-32'> {plan.title}</div>
                                                </div>
                                            </CardTitle>
                                        </DialogTrigger>
                                        <DialogContent className='p-0 border-0 bg-transparent rounded-lg'>
                                            <DialogHeader >
                                                <DialogTitle className=' hidden'></DialogTitle>
                                                <DialogDescription className='hidden'></DialogDescription>
                                                <Card>
                                                    <CardHeader className='px-0 mt-1'>
                                                        <CardTitle className="text-xl pl-8 pr-6 flex flex-row items-center justify-between">
                                                            {plan.title}
                                                            <div className=' '>
                                                                <Button variant='outline' className="border-0 h-6 ring-0 shadow-none ">
                                                                    <PencilIcon />
                                                                </Button>
                                                                <Button variant='outline' className="border-0 h-6 ring-0 shadow-none ">
                                                                    <Trash2Icon />
                                                                </Button>
                                                            </div>
                                                        </CardTitle>
                                                        <ExercisesWithPagination plan={plan} />
                                                    </CardHeader>
                                                </Card>
                                            </DialogHeader>
                                            {/* <DialogFooter className="sm:justify-start">
                                            <DialogClose asChild>
                                                <Button type="button" variant="secondary">
                                                    Close
                                                </Button>
                                            </DialogClose>
                                        </DialogFooter> */}
                                        </DialogContent>
                                    </Dialog>

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

export default ShowExercisePlan