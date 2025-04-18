'use client'
import { useSelectedExercises } from '@/server/queries';
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

import { Button } from '../ui/button';
import GetExercise from '../AdminComponents/getExercise';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import PlanDialogForm from './planForm';
import { useCreatePlan } from '@/server/mutations';
import { Exercise, ExercisePlan, ExerciseOption } from '@/utils/util';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import LoadingOverlay from '../LayoutCompents/LoadingOverlay';




const formSchema2 = z.object({
    title: z.string().min(1, '제목을 입력해주세요').max(10, '10자 이내로 입력해주세요'),
})

const CreatPlanUser = () => {
    const { data } = useSelectedExercises(); // 필요한 운동 종목 데이터를 가져옴
    const [exerciseOption, setExerciseOption] = useState<ExerciseOption[]>([]) // 이건 세트, 반복횟수, 휴식시간을 저장하는 변수
    const formRef = useRef<HTMLFormElement>(null);
    const form = useForm<z.infer<typeof formSchema2>>({
        resolver: zodResolver(formSchema2),
        defaultValues: {
            title: '',
        },
    });
    const { mutateAsync, isPending } = useCreatePlan();
    const router = useRouter(); // 라우터


    useEffect(() => {
        // 초기 값 설정 - data가 추가 되면 exerciseOption 초기값 필드를 추가
        if (!data) return;

        const defaultData = { sets: 4, reps: 6, weight: 30 };
        const newState: ExerciseOption[] = data.map(ex => ({
            exerciseId: ex._id,
            title: ex.title,
            sets: exerciseOption.find(v => v.exerciseId === ex._id)?.sets || defaultData.sets, // 기존값 || 기본값
            reps: exerciseOption.find(v => v.exerciseId === ex._id)?.reps || defaultData.reps,
            weight: exerciseOption.find(v => v.exerciseId === ex._id)?.weight || defaultData.weight,
        }));

        setExerciseOption(newState);
    }, [data]);



    async function onSubmit2(values: z.infer<typeof formSchema2>) {
        // 루틴 제출 로직
        if (exerciseOption.length === 0) {
            toast({ variant: 'destructive', title: '운동을 추가해주세요.' });
            return;
        }
        const exercisePlan: ExercisePlan = {
            title: values.title,
            exercises: exerciseOption
        }
        const res = await mutateAsync(exercisePlan);
        if (res) {
            form.reset(); // 폼 초기화
            setExerciseOption([]); // 데이터 초기화
            router.push('/dashboard'); // 페이지 이동
        }
    }

    return (
        <div className="mx-auto max-h-screen w-full max-w-3xl " >
            <div className='space-y-8'>
                <h1 className="text-3xl font-bold mb-4">운동 플랜 생성</h1>
                <div className='flex flex-col gap-4'>
                    <Form {...form}>
                        <form ref={formRef} onSubmit={form.handleSubmit(onSubmit2)} className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>루틴 이름</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ex) 월요일 루틴, 상체 + 가슴" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                    <GetExercise />
                    <Card className='px-5 dark:bg-zinc-950'>
                        <div className='flex flex-col max-h-[35vh] scrollbar-none overflow-y-scroll pb-4'>
                            {
                                exerciseOption?.map((item) => (
                                    <Card key={item.exerciseId} className='mt-5'>
                                        <CardHeader >
                                            <CardTitle className='flex flex-row justify-between'>
                                                <div className='flex items-center'>
                                                    {item.title}
                                                </div>
                                            </CardTitle>
                                            <PlanDialogForm item={item} key={item.exerciseId} SetState={setExerciseOption} />
                                        </CardHeader>
                                    </Card>
                                ))
                            }
                        </div>
                    </Card>

                    <div className='flex justify-end'>
                        <Button className='' onClick={() => formRef.current?.requestSubmit()}>루틴 저장하기</Button>
                    </div>
                </div>
            </div>
            {isPending && <LoadingOverlay isLoading={isPending} text={'로딩 중'} />} {/* ✅ 로딩 오버레이 */}
        </div>
    )
}

export default CreatPlanUser

