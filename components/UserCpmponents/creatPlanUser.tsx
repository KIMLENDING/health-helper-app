import { getSelectedExercises } from '@/server/queries';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useSession } from 'next-auth/react';
import { Button } from '../ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import GetExercise from '../AdminComponents/getExercise';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { XIcon } from 'lucide-react';
import PlanDialogForm from './planForm';
import { useCreatePlan } from '@/server/mutations';
import { Exercise, ExercisePlan, exercises } from '@/utils/util';




const formSchema2 = z.object({
    title: z.string(),
    description: z.string(),

})

const CreatPlanUser = () => {
    const form = useForm<z.infer<typeof formSchema2>>({
        resolver: zodResolver(formSchema2),
        defaultValues: {
            title: '',
            description: '',
        },
    });
    const { data: session } = useSession();
    const [planData, setPlanData] = useState<Exercise[]>([]) // 가져온 운동 종목 데이터를 저장하는 변수
    const [enterPlanData, setEnterPlanData] = useState<exercises[]>([]) // 이건 서버에 보낼 데이터
    const { data, error, isLoading } = getSelectedExercises(); // 필요한 운동 종목 데이터를 가져옵니다.
    const useCreatePlanMutation = useCreatePlan();
    useEffect(() => { // 데이터가 있으면 planData에 추가합니다.
        if (data) {
            setPlanData(prevState => {
                const existingExercise = prevState.find(exercise => exercise._id === data[0]._id)
                if (existingExercise) {
                    return prevState;
                } else {
                    return [...prevState, ...data];
                }
            });
        }
    }, [data])

    const handleDelete = (id: string) => {
        // 삭제 로직
        // 운동 종목 삭제
        setPlanData(prevState => prevState.filter(exercise => exercise._id !== id)) // 삭제할 데이터를 제외한 나머지 데이터를 반환합니다.
        // 상세 데이터 삭제 - 세트, 반복횟수, 휴식시간 , exerciseId
        setEnterPlanData(prevState => prevState.filter(exercise => exercise.exerciseId !== id)) // 삭제할 데이터를 제외한 나머지 데이터를 반환합니다.
    }
    function onSubmit2(values: z.infer<typeof formSchema2>) {
        // 루틴 제출 로직
        if (session?.user._id === undefined) return;
        const exercisePlan: ExercisePlan = {
            userId: session?.user._id,
            title: values.title,
            description: values.description,
            exercises: enterPlanData
        }
        useCreatePlanMutation.mutate(exercisePlan);
    }


    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="mx-auto  min-h-min w-full max-w-3xl rounded-xl bg-muted/50" >
            <Card>
                <CardHeader >
                    <div className='space-y-8'>
                        <div className='flex justify-between'>
                            <div className='flex flex-col gap-2'>
                                <CardTitle>루틴에 운동 추가</CardTitle>
                                <CardDescription>순서는 나중에 설정할 수 있습니다.</CardDescription>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button >추가</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    {/* <DialogHeader> */}
                                    <DialogTitle></DialogTitle>
                                    <DialogDescription></DialogDescription>
                                    <div className="relative mb-4">
                                        <GetExercise />
                                    </div>
                                    {/* </DialogHeader> */}
                                    <DialogFooter className="sm:justify-start">
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary">
                                                Close
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit2)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>루틴 이름</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="ex) 월요일 루틴, 상체+가슴" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}

                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>설명</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="ex) 상체 펌핑" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <CardContent className='rounded-md shadow-inner bg-zinc-300 dark:bg-zinc-800 '>
                                        <div className='rounded-md  '>
                                            <div className='flex flex-col   max-h-[45vh] scrollbar-none overflow-y-scroll'>

                                                {planData.length !== 0 ? planData?.map((item) => (
                                                    <Card key={item._id} className='mt-5 '>
                                                        <CardHeader >
                                                            <CardTitle className='flex flex-row justify-between'>
                                                                <div className='flex items-center'>
                                                                    {item.title}
                                                                </div>
                                                                <Button variant="outline" size="icon" onClick={() => handleDelete(item._id)}>
                                                                    <XIcon />
                                                                </Button>
                                                            </CardTitle>

                                                            <PlanDialogForm item={item} key={item._id} SetState={setEnterPlanData} state={enterPlanData.find((v) => v.exerciseId === item._id)} />
                                                        </CardHeader>
                                                    </Card>
                                                )) : <div className='pt-6 flex justify-center items-center'> 루틴을 추가하세요</div>}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <Button type="submit">Submit</Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                    {/* <CardDescription></CardDescription> */}
                </CardHeader>

            </Card>
        </div>

    )
}

export default CreatPlanUser