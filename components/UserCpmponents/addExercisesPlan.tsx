
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

import { Button } from '../ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import GetExercise from '../AdminComponents/getExercise';

import PlanDialogForm from './planForm';
import { ExerciseOption } from '@/utils/util';

import { useUpdatePlan } from '@/server/mutations';



const AddExercisesPlan = ({ plan_id }: { plan_id: string }) => {

    const [isOpen, setIsOpen] = useState(false); // 다이얼로그 창 열기

    const [exerciseOption, setExerciseOption] = useState<ExerciseOption[]>([]) // 이건 세트, 반복횟수, 무게를를 저장하는 변수
    // const { data, error, isLoading } = useSelectedExercises(); // 필요한 운동 종목 데이터를 가져옵니다.
    const useUpdatePlanMutation = useUpdatePlan();

    const handleUpdate = async () => {
        {
            const newUpdataData = {
                exercisePlanId: plan_id,
                exercises: exerciseOption,
            }
            const res = await useUpdatePlanMutation.mutateAsync(newUpdataData);
            if (res) {
                setExerciseOption([])
                setIsOpen(false)
            }
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger asChild onClick={() => setIsOpen(true)}>
                <Button >운동 추가 </Button>
            </DialogTrigger>
            <DialogContent className='p-0 border-0 bg-transparent rounded-lg'>
                {/* <DialogHeader> */}
                <DialogTitle className=' hidden'></DialogTitle>
                <DialogDescription className='hidden'></DialogDescription>
                <div className="mx-auto  min-h-min w-full max-w-3xl rounded-xl bg-muted/50" >
                    <Card>
                        <CardHeader >
                            <div className='space-y-8 m-4'>
                                <div className='flex justify-between'>

                                    <CardTitle className='flex items-center'>운동 추가</CardTitle>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button >추가</Button>
                                        </DialogTrigger>
                                        <DialogContent className='p-0 border-0 bg-transparent rounded-lg'>

                                            <DialogTitle className=' hidden'></DialogTitle>
                                            <DialogDescription className='hidden'></DialogDescription>
                                            <GetExercise />

                                            <DialogFooter className="sm:justify-start">

                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <div>
                                    <CardContent className='rounded-md shadow-inner bg-zinc-300 dark:bg-zinc-800 my-4'>
                                        <div className='rounded-md  '>
                                            <div className='flex flex-col max-h-[30vh] scrollbar-none overflow-y-scroll'>
                                                {exerciseOption?.map((item, index) => (
                                                    <Card key={index} className='mt-5 '>
                                                        <CardHeader >
                                                            <CardTitle className='flex flex-row justify-between'>
                                                                <div className='flex items-center'>
                                                                    {item.title}
                                                                </div>

                                                            </CardTitle>

                                                            <PlanDialogForm item={item} key={index} SetState={setExerciseOption} />
                                                        </CardHeader>
                                                    </Card>
                                                ))}

                                            </div>
                                        </div>
                                    </CardContent>
                                </div>
                            </div>
                        </CardHeader>

                    </Card>
                </div>


                {/* </DialogHeader> */}
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={handleUpdate} >
                            save
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

export default AddExercisesPlan