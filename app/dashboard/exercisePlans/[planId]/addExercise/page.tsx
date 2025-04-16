'use client';
import { columns } from '@/components/Table/columns';
import { DataTable } from '@/components/Table/data-table';
import { useEexercises, useExercisePlanById } from '@/server/queries';
import React, { use } from 'react';
import { Loader2, PlusCircle, ListFilter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

/** 플랜 세부 CRUD 페이지 */
type Params = Promise<{ planId: string }>;

const Page = (props: {
    params: Params;
}) => {
    const params = use(props.params);
    const planId = params.planId;
    const { data: preData } = useExercisePlanById(planId);
    const { data, isLoading } = useEexercises();

    const filteredData = data?.filter(
        (exercise: any) => !preData?.exercises.some((pre: any) => pre.exerciseId === exercise._id)
    );

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
                    <Badge variant="outline" className="text-xs bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30">
                        플랜 ID: {planId}
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
        </section>
    );
};

export default Page;