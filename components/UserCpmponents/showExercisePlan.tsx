'use client'
import { getExercisePlan, } from '@/server/queries';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle } from '../ui/card';
import ExercisesWithPagination from './exercisesWithPagination';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { BicepsFlexed, DumbbellIcon, FlagIcon, PencilIcon, RadicalIcon, SparklesIcon, Trash2Icon, VolleyballIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useDeletePlan, useEditPlanTitle } from '@/server/mutations';
import LoadingSpinner from '../LayoutCompents/LoadingSpinner';
import LoadingOverlay from '../LayoutCompents/LoadingOverlay';
import { ExercisePlan } from '@/utils/util';
import { Input } from '../ui/input';

const ShowExercisePlan = () => {

    const { data, error, isLoading } = getExercisePlan(); // 필요한 운동 계획 데이터를 가져옵니다.
    const [editingPlanId, setEditingPlanId] = useState<string | undefined>(undefined);
    const [editTitle, setEditTitle] = useState('');
    const useDeletePlanMutation = useDeletePlan();
    const useEditPlanTitleMutation = useEditPlanTitle();
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('삭제 진행 중...');
    console.log(data, isLoading)
    const Icons = [
        { name: 'BicepsFlexed', icon: <BicepsFlexed className='text-green-400' /> },
        { name: 'DumbbellIcon', icon: <DumbbellIcon className='text-green-400' /> },
        { name: 'SparklesIcon', icon: <SparklesIcon className='text-green-400' /> },
        { name: 'RadicalIcon', icon: <RadicalIcon className='text-green-400' /> },
        { name: 'VolleyballIcon', icon: <VolleyballIcon className='text-green-400' /> },
    ]
    const startEditing = (plan: ExercisePlan) => {
        if (!plan) return;
        if (!plan._id) return;
        setEditingPlanId(plan._id);
        setEditTitle(plan.title);
    };
    const saveTitle = async (planId: string | undefined) => {
        if (!planId) return;
        try {
            setLoading(true);
            setLoadingText('제목 수정 중...');
            await useEditPlanTitleMutation.mutateAsync({ exercisePlanId: planId, title: editTitle });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setEditingPlanId(undefined);
            setEditTitle('');
            setLoadingText('');
        }

    };

    const handleDelete = async (planId: string) => {
        if (!planId) return;
        try {
            setLoading(true);
            await useDeletePlanMutation.mutateAsync(planId);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }



    return (
        <div className='mx-auto w-full max-w-3xl rounded-xl'>
            {loading && <LoadingOverlay isLoading={loading} text={loadingText} />}
            <CardTitle className='my-3 font-extrabold text-2xl flex'>

                <div className='flex flex-row gap-2 items-center'>
                    <FlagIcon className='text-red-400' />
                    플랜 목록
                </div>
            </CardTitle>
            {isLoading ? (
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((index) => (
                        <div key={index} className="h-16 bg-gray-200 dark:bg-zinc-700 animate-pulse rounded-lg" />
                    ))}
                </div>
            ) : (
                <>
                    {data ?
                        <div className='flex flex-col gap-3 rounded-xl bg-muted/50 p-2 max-h-[70vh] overflow-scroll'>{
                            data.map((plan) => {
                                const randomIndex = Math.floor(Math.random() * Icons.length);
                                const randomIcon = Icons[randomIndex]?.icon;
                                return (
                                    <Card key={plan.title} className='aspect-auto '>
                                        <CardHeader className='px-0'>
                                            <Dialog >
                                                <DialogTrigger asChild>
                                                    <CardTitle className="text-xl px-6 cursor-pointer  hover:underline">
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
                                                                <CardTitle className="text-xl pl-6 pr-6 flex flex-row items-center justify-between">
                                                                    {editingPlanId === plan._id ? (
                                                                        <div className="flex flex-1 items-center space-x-2">
                                                                            <Input
                                                                                value={editTitle}
                                                                                onChange={(e) => setEditTitle(e.target.value)}
                                                                                className="w-full"
                                                                            />
                                                                            <Button
                                                                                onClick={() => saveTitle(plan._id!)}
                                                                                className="border-0 h-6 ring-0 shadow-none ">
                                                                                Save
                                                                            </Button>
                                                                            <Button
                                                                                className="border-0 h-6 ring-0 shadow-none "
                                                                                variant="outline"
                                                                                onClick={() => setEditingPlanId(undefined)}
                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <CardTitle>{plan.title}</CardTitle>

                                                                            <div className=' '>
                                                                                <Button variant='outline' className="border-0 h-6 ring-0 shadow-none " onClick={() => startEditing(plan)}>
                                                                                    <PencilIcon />
                                                                                </Button>
                                                                                <Button variant='outline' className="border-0 h-6 ring-0 shadow-none " onClick={() => handleDelete(plan._id!)}>
                                                                                    <Trash2Icon />
                                                                                </Button>
                                                                            </div>
                                                                        </>
                                                                    )}
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
                </>
            )}

        </div>
    )
}

export default ShowExercisePlan