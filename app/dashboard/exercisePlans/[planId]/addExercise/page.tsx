'use client';
import { columns } from '@/components/Table/columns';
import { DataTable } from '@/components/Table/data-table';
import { useSelectedExercises } from '@/server/queries';
import React, { use, useEffect, useState } from 'react';
import { Loader2, PlusCircle, ListFilter, ListPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ExerciseOption } from '@/utils/util';
import PlanDialogForm from '@/components/UserCpmponents/planForm';
import { Button } from '@/components/ui/button';

import { useRouter } from 'next/navigation';
import { useUpdatePlan } from '@/server/user/exercisePlan/mutations';
import { useExercisePlanById } from '@/server/user/exercisePlan/queries';
import { useEexercises } from '@/server/admin/queries';

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
        // 초기 값 설정 - data가 추가 되면 exerciseOption 초기값 필드를 추가
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
            <section className="mx-auto w-full max-w-3xl p-4 space-y-6">
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
        <section className="mx-auto w-full max-w-3xl p-4 space-y-6">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">운동 추가</h1>
                    <Badge variant="outline" className="text-xs bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 max-w-52">
                        {preData?.title}
                    </Badge>
                </div>
                <p className="text-muted-foreground">
                    운동을 선택하여 운동 계획에 추가하세요. 체크박스로 여러 운동을 한 번에 선택할 수 있습니다.
                </p>
            </div>

            <Separator className="my-6" />

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
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">운동 옵션</h3>
                    <Badge variant="outline" className="text-xs">
                        {exerciseOption?.length || 0}개 항목
                    </Badge>
                </div>

                <Separator className="mb-3" />

                <div className="flex flex-col gap-2 max-h-[25vh] overflow-y-auto pr-1 scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-muted/10 pb-1">
                    {exerciseOption?.length ? (
                        exerciseOption.map((item) => (
                            <Card
                                key={item.exerciseId}
                                className="border border-muted/40 hover:border-muted transition-colors group dark:hover:bg-zinc-900/50"
                            >
                                <CardHeader className="p-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-primary/80"></div>
                                            <span className="truncate">{item.title}</span>
                                        </CardTitle>
                                        <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                                            <PlanDialogForm item={item} key={item.exerciseId} SetState={setExerciseOption} />
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                            <div className="rounded-full bg-muted/30 p-3 mb-2">
                                <ListPlus className="h-5 w-5" />
                            </div>
                            <p className="font-medium">운동 옵션이 없습니다</p>
                            <p className="text-sm mt-1">새 운동 옵션을 추가해 보세요</p>
                        </div>
                    )}
                </div>

                {exerciseOption?.length > 5 && (
                    <div className="mt-2 pt-2 border-t border-muted/30 text-center">
                        <p className="text-xs text-muted-foreground">
                            스크롤하여 더 많은 옵션 보기
                        </p>
                    </div>
                )}
            </Card>

            <div className='flex justify-end'>
                <Button onClick={handleSave} disabled={isPending}>루틴 저장하기</Button>
            </div>
        </section>
    );
};

export default Page;