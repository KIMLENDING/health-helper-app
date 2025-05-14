'use client'
import { useSelectedExercises } from '@/server/queries';
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

import { Button } from '../ui/button';
import GetExercise from '../AdminComponents/getExercise';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import PlanDialogForm from './planForm';

import { ExercisePlan, ExerciseOption } from '@/utils/util';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import LoadingOverlay from '../LayoutCompents/LoadingOverlay';
import { Badge } from '../ui/badge';
import {
    ListPlus,
    Dumbbell,
    Save,
    Info,
    CalendarClock,
    ArrowLeft,
    FileEdit
} from 'lucide-react';
import { useCreatePlan } from '@/server/user/exercisePlan/mutations';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const formSchema2 = z.object({
    title: z.string()
        .min(1, '제목을 입력해주세요')
        .max(20, '20자 이내로 입력해주세요'),
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
            toast({
                variant: 'destructive',
                title: '운동을 추가해주세요',
                description: '최소 한 개 이상의 운동이 필요합니다.'
            });
            return;
        }
        const exercisePlan: ExercisePlan = {
            title: values.title,
            exercises: exerciseOption
        }

        try {
            const res = await mutateAsync(exercisePlan);
            if (res) {
                form.reset(); // 폼 초기화
                setExerciseOption([]); // 데이터 초기화

                toast({
                    title: "플랜 생성 완료!",
                    description: `"${values.title}" 플랜이 성공적으로 저장되었습니다.`,
                    variant: "default",
                });

                router.push('/dashboard'); // 페이지 이동
            }
        } catch (error) {
            toast({
                title: "플랜 저장 실패",
                description: "문제가 발생했습니다. 다시 시도해주세요.",
                variant: "destructive",
            });
        }
    }

    return (
        <div className="mx-auto w-full max-w-4xl  py-4">
            <div className='space-y-6'>
                {/* 헤더 섹션 */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-xl shadow-lg">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/30 hover:text-white"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2 break-keep">운동 플랜 생성</h1>
                            <p className="text-emerald-100 break-keep">나만의 맞춤형 운동 루틴을 설계하세요.</p>
                        </div>
                    </div>
                </div>

                {/* 단계별 프로세스 가이드 */}
                <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-medium">1</div>
                        <span className="text-sm font-medium break-keep">루틴 이름 입력</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-zinc-400 dark:bg-zinc-700 mx-2"></div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-medium">2</div>
                        <span className="text-sm font-medium break-keep">운동 선택</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-zinc-400 dark:bg-zinc-700 mx-2"></div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-medium">3</div>
                        <span className="text-sm font-medium break-keep">세트 구성</span>
                    </div>
                </div>

                <div className='flex flex-col gap-6'>
                    {/* 루틴 이름 입력 카드 */}
                    <Card className="border border-emerald-100 dark:border-emerald-800/30 shadow-md">
                        <CardHeader className="pb-3 bg-emerald-50/50 dark:bg-emerald-900/10">
                            <div className="flex items-center gap-2">
                                <CalendarClock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                <CardTitle className="text-lg font-medium break-keep">루틴 정보</CardTitle>
                            </div>
                            <CardDescription>
                                이 루틴의 이름과 목적을 입력하세요
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <Form {...form}>
                                <form ref={formRef} onSubmit={form.handleSubmit(onSubmit2)} className="flex flex-col gap-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <FileEdit className="h-4 w-4" />
                                                    루틴 이름
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="예: 월요일 상체 루틴, 3분할 1일차"
                                                        {...field}
                                                        className="focus-visible:ring-emerald-500"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    {/* 운동 선택 리스트 */}

                    <GetExercise />


                    {/* 선택된 운동 옵션 카드 */}
                    <Card className="border border-emerald-100 dark:border-emerald-800/30 shadow-md">
                        <CardHeader className="pb-3 bg-emerald-50/50 dark:bg-emerald-900/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ListPlus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    <CardTitle className="text-lg font-medium break-keep">선택된 운동</CardTitle>
                                </div>
                                <Badge
                                    variant={exerciseOption?.length > 0 ? "default" : "outline"}
                                    className={`${exerciseOption?.length > 0 ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                                >
                                    {exerciseOption?.length || 0}개 선택됨
                                </Badge>
                            </div>
                            <CardDescription>
                                각 운동의 세트, 반복 횟수, 무게를 설정하세요
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="flex flex-col gap-3 max-h-[40vh] overflow-y-auto pr-1 scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thin scrollbar-thumb-emerald-300/20 dark:scrollbar-thumb-emerald-600/30 scrollbar-track-muted/10 pb-1">
                                {exerciseOption?.length ? (
                                    exerciseOption.map((item) => (
                                        <Card
                                            key={item.exerciseId}
                                            className="border border-emerald-50 dark:border-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-800/30 transition-colors group hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10"
                                        >
                                            <CardHeader className="p-3">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-base flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                                        <span className="break-keep">{item.title}</span>
                                                    </CardTitle>
                                                    <div className="opacity-90 group-hover:opacity-100 transition-opacity">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div>
                                                                        <PlanDialogForm item={item} key={item.exerciseId} SetState={setExerciseOption} />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>운동 세부 설정</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 mt-1">
                                                    <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20">
                                                        {item.sets}세트
                                                    </Badge>
                                                    <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20">
                                                        {item.reps}회
                                                    </Badge>
                                                    <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20">
                                                        {item.weight}kg
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                        <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-4 mb-3">
                                            <Dumbbell className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <p className="font-medium text-gray-700 dark:text-gray-300">운동이 선택되지 않았습니다</p>
                                        <p className="text-sm mt-1 text-gray-500 dark:text-gray-400 break-keep">
                                            위의 &apos;운동 선택&apos; 섹션에서 원하는 운동을 추가해주세요
                                        </p>
                                    </div>
                                )}
                            </div>

                            {exerciseOption?.length > 5 && (
                                <div className="mt-3 pt-2 border-t border-muted/30 text-center">
                                    <p className="text-xs text-muted-foreground">
                                        스크롤하여 더 많은 운동 보기
                                    </p>
                                </div>
                            )}
                        </CardContent>
                        {exerciseOption?.length > 0 && (
                            <CardFooter className="bg-emerald-50/50 dark:bg-emerald-900/10 border-t pt-4">
                                <div className="flex items-start gap-3 w-full">
                                    <Info className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-emerald-700 dark:text-emerald-300 break-keep">
                                        각 운동 항목을 수정하려면 해당 운동 오른쪽의 편집 버튼을 클릭하세요.
                                        운동 순서는 위에서 선택한 순서대로 저장됩니다.
                                    </p>
                                </div>
                            </CardFooter>
                        )}
                    </Card>

                    {/* 저장 버튼 */}
                    <div className='flex justify-between items-center'>
                        <Button
                            variant="outline"
                            className="border-emerald-200 hover:border-emerald-300 dark:border-emerald-800/30"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            취소
                        </Button>
                        <Button
                            className='bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                            onClick={() => formRef.current?.requestSubmit()}
                            disabled={isPending || !form.formState.isValid || exerciseOption.length === 0}
                        >
                            {isPending ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    저장 중...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    루틴 저장하기
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
            {isPending && <LoadingOverlay isLoading={isPending} text={'플랜 저장 중...'} />}
        </div>
    )
}

export default CreatPlanUser