'use client';
import { columns } from '@/components/Table/columns';
import { DataTable } from '@/components/Table/data-table';
import { useSelectedExercises } from '@/server/queries';
import React, { use, useEffect, useState } from 'react';
import { Loader2, PlusCircle, ListFilter, ListPlus, ArrowLeft, Info, Dumbbell, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ExerciseOption } from '@/utils/util';
import PlanDialogForm from '@/components/UserCpmponents/planForm';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useUpdatePlan } from '@/server/user/exercisePlan/mutations';
import { useExercisePlanById } from '@/server/user/exercisePlan/queries';
import { useEexercises } from '@/server/admin/queries';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/** 플랜 세부 CRUD 페이지 */
type Params = Promise<{ planId: string }>;

const Page = (props: {
    params: Params;
}) => {
    const params = use(props.params);
    const planId = params.planId;
    const { data: preData } = useExercisePlanById(planId);
    const { data, isLoading } = useEexercises();
    const { data: selectedItmes } = useSelectedExercises(); // 필요한 운동 종목 데이터를 가져옴
    const [exerciseOption, setExerciseOption] = useState<ExerciseOption[]>([]) //  세트, 반복횟수, 무게 저장하는 변수
    const { mutate, isPending } = useUpdatePlan(); // 플랜 업데이트를 위한 훅
    const router = useRouter(); // 페이지 이동을 위한 훅
    const filteredData = React.useMemo(() => {
        // useMemo를 사용하여 성능 최적화
        // selectedItems로 인해 filteredData이 다시 계산되면서 테이블의 불필요한 재랜더링을 방지하기 위해 useMemo를 사용함
        return data?.filter(
            (exercise: any) => !preData?.exercises.some((pre: any) => pre.exerciseId._id === exercise._id)
        );
    }, [data, preData]);

    useEffect(() => {
        // 초기 값 설정 - selectedItmes이 추가 되면 exerciseOption에 초기값을 설정
        if (!selectedItmes) return;

        const defaultData = { sets: 4, reps: 6, weight: 30 };
        const newState: ExerciseOption[] = selectedItmes.map(ex => ({
            exerciseId: ex._id,
            title: ex.title,
            sets: exerciseOption.find(v => v.exerciseId === ex._id)?.sets || defaultData.sets, // 기존값 || 기본값
            reps: exerciseOption.find(v => v.exerciseId === ex._id)?.reps || defaultData.reps,
            weight: exerciseOption.find(v => v.exerciseId === ex._id)?.weight || defaultData.weight,
        }));

        setExerciseOption(newState);
    }, [selectedItmes]);

    const handleSave = async () => {
        // 서버에 저장하는 로직을 추가해야 함
        const data = {
            exercisePlanId: planId,
            exercises: exerciseOption
        }
        mutate(data); // 플랜 업데이트
        router.push(`/dashboard/exercisePlans/${planId}`); // 플랜 목록 페이지로 이동

    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-80 space-y-4">
                <div className="relative">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-t from-background to-transparent opacity-50 rounded-full" />
                </div>
                <span className="text-lg font-medium text-muted-foreground">운동 정보를 불러오는 중...</span>
            </div>
        );
    }

    if (!filteredData || filteredData.length === 0) {
        return (
            <section className="mx-auto w-full max-w-4xl px-4 py-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">운동 추가</h1>
                    <p className="text-muted-foreground mt-2">
                        현재 운동 계획에 추가할 수 있는 운동을 확인합니다.
                    </p>
                </div>
                <Separator />
                <Card className="mt-6 border border-muted bg-card/50">
                    <CardContent className="pt-10 pb-10 text-center">
                        <div className="rounded-full bg-muted/50 p-3 inline-block mb-4">
                            <ListFilter className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-xl font-medium">운동이 없습니다</p>
                        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                            모든 운동이 이미 플랜에 추가되었거나 사용 가능한 운동이 없습니다.
                        </p>
                    </CardContent>
                </Card>
            </section>
        );
    }

    const totalExercises = data?.length || 0;
    const addedExercises = totalExercises - filteredData.length;

    return (
        <section className="mx-auto w-full  max-w-4xl px-4 py-6 space-y-6">

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
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white mb-2">운동 추가</h1>
                        <p className="text-emerald-100">
                            <span className='text-xl text-black '>{preData?.title}</span> 에 필요한 운동을 추가하세요.
                        </p>
                    </div>
                </div>
            </div>


            <Card className="border-muted shadow-sm dark:shadow-md dark:shadow-black/10">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold flex items-center">
                            <PlusCircle className="h-5 w-5 mr-2 text-primary" />
                            사용 가능한 운동
                        </CardTitle>
                        <div className="flex space-x-2">
                            <Badge variant="secondary" className="font-normal">
                                총 {totalExercises}개 운동
                            </Badge>
                            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50">
                                {filteredData.length}개 선택 가능
                            </Badge>
                        </div>
                    </div>
                    <CardDescription>
                        이미 플랜에 추가된 운동 {addedExercises}개는 목록에서 제외되었습니다.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="rounded-md overflow-hidden">
                        <DataTable columns={columns} data={filteredData} />
                    </div>
                </CardContent>
            </Card>
            <Card className="p-4 dark:bg-zinc-950 border-muted shadow-sm">
                <CardHeader className="pb-3 bg-emerald-50/50 dark:bg-emerald-900/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ListPlus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            <CardTitle className="text-lg font-medium">선택된 운동</CardTitle>
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
                                                <span className="truncate">{item.title}</span>
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
                                <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
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
                            <p className="text-sm text-emerald-700 dark:text-emerald-300">
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
                    onClick={handleSave}
                    disabled={isPending || exerciseOption.length === 0}
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
        </section>
    );
};

export default Page;