'use client';
import LoadingOverlay from '@/components/LayoutCompents/LoadingOverlay';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Save, X, Edit, Trash2, PlusSquare, Loader2, Play, ChevronsDown, Info, Layers, Repeat, Weight, } from 'lucide-react';
import React, { use, useEffect, useRef, useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DrawerDialogDemo } from '@/components/LayoutCompents/ResponsiveDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BreadcrumbEllipsis } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import { useDeletePlan, useEditPlan } from '@/server/user/exercisePlan/mutations';
import { useExercisePlanById } from '@/server/user/exercisePlan/queries';

/** 플랜 세부 CRUD 페이지 */
type Params = Promise<{ planId: string }>;

const ExercisePlanDetailPage = (props: {
    params: Params;
}) => {
    const params = use(props.params);
    const planId = params.planId;
    const route = useRouter();
    const { data, isPending: isPendingData } = useExercisePlanById(planId);
    // 운동 계획 수정
    const { mutateAsync, isPending } = useEditPlan();
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedExercises, setEditedExercises] = useState<any[]>([]);
    const [deleteItem, setDeleteItem] = useState<string[]>([]); // 삭제된 운동 ID 목록

    // 플랜 삭제
    const { mutate: deletPlan } = useDeletePlan();

    // 스크롤 상태를 추적하기 위한 상태 추가
    const [isScrolled, setIsScrolled] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // 편집 모드 시작
    const handleStartEditing = () => {
        setEditedTitle(data?.title || '');
        setEditedExercises(data?.exercises.map(ex => ({
            ...ex,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight
        })) || []);
        setIsEditing(true);
    };

    // 편집 취소
    const handleCancelEditing = () => {
        setIsEditing(false);
    };

    // 특정 운동의 세부 정보 수정
    const handleExerciseChange = (exerciseIndex: number, field: string, value: number) => {
        const updatedExercises = [...editedExercises];
        updatedExercises[exerciseIndex] = {
            ...updatedExercises[exerciseIndex],
            [field]: value
        };
        setEditedExercises(updatedExercises);
    };

    // 수정 사항 저장
    const handleSaveChanges = async () => {
        try {
            const updatedData = {
                exercisePlanId: planId,
                title: editedTitle,
                exercises: editedExercises
            };
            await mutateAsync(updatedData);
            setIsEditing(false);
            setDeleteItem([]); // 삭제 항목 초기화
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    /** 운동 삭제 */
    const handleRemoveExercise = (id: string) => {
        setDeleteItem((prev) => [...prev, id]);
        setEditedExercises(
            (prev => prev.filter(ex => ex._id !== id)) // 삭제된 운동 제외
        );
    }

    /** 플랜 삭제*/
    const handleDeletePlan = () => {
        // 삭제 로직 추가
        deletPlan(planId)
        route.push('/dashboard/exercisePlans')
    };

    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
            // 스크롤이 거의 바닥에 도달했는지 확인 (여유 공간 10px)
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
            setIsScrolled(isAtBottom);
        }
    };

    // 컴포넌트 마운트 시 스크롤 이벤트 리스너 등록 (useEffect 내에 추가)
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            // 초기 상태 확인
            handleScroll();
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    // 무게 클래스 결정 함수
    function getWeightClass(weight: number): string {
        if (weight >= 150) return 'bg-red-200 dark:bg-red-700';
        if (weight >= 120) return 'bg-red-100 dark:bg-red-600';
        if (weight >= 100) return 'bg-violet-300 dark:bg-violet-800/50';
        if (weight >= 90) return 'bg-violet-200 dark:bg-violet-700/50';
        if (weight >= 80) return 'bg-indigo-400 dark:bg-indigo-800/50';
        if (weight >= 70) return 'bg-indigo-300 dark:bg-indigo-700/50';
        if (weight >= 60) return 'bg-emerald-300 dark:bg-emerald-600/50';
        if (weight >= 50) return 'bg-emerald-200 dark:bg-emerald-500/50';
        if (weight >= 40) return 'bg-green-300 dark:bg-green-600/50';
        if (weight >= 30) return 'bg-green-200 dark:bg-green-500/50';
        if (weight >= 20) return 'bg-yellow-300 dark:bg-yellow-400/50';
        if (weight >= 10) return 'bg-yellow-200 dark:bg-yellow-300/50';
        return 'bg-secondary/10';
    }


    // 로딩 상태에 따라 다른 컴포넌트 렌더링
    if (isPending) return <LoadingOverlay isLoading={isPending} text={'처리 중...'} />;
    if (isPendingData) return <LoadingOverlay isLoading={isPendingData} text={'로딩 중...'} />;
    if (!data) return <div className="p-8 text-center">운동 계획을 찾을 수 없습니다.</div>;

    return (
        <section className='mx-auto w-full max-w-3xl p-4'>
            <div className="mb-6 flex items-center justify-between gap-2">
                {isEditing ? (
                    <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="text-xl font-bold "
                    />
                ) : (
                    <h1 className="text-2xl font-bold">{data.title}</h1>
                )}
                <div className='flex items-center gap-2 shrink-0  '>
                    <Badge variant="outline" className="px-3 py-1 shrink-0">
                        {formatDate(data.createdAt!)}
                    </Badge>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <BreadcrumbEllipsis className='h-4 w-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onClick={handleStartEditing}
                                disabled={isPending || isEditing}
                                className="flex items-center cursor-pointer"
                            >
                                <Edit className="mr-2 h-4 w-4 text-blue-500" />
                                <span>수정</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={isPending || isEditing}
                                className="flex items-center cursor-pointer"
                                asChild
                            >
                                <Link href={`/dashboard/exercisePlans/${planId}/addExercise`} className="w-full flex items-center">
                                    <PlusSquare className="mr-2 h-4 w-4 text-green-500" />
                                    <span>운동 추가</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={isPending || isEditing}
                                className="flex items-center cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 focus:bg-red-50 dark:focus:bg-red-950/50"
                                onClick={() => handleDeletePlan()}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>플랜 삭제</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="mb-4 flex items-center  ">

                <Badge variant="secondary" className="px-3 py-1">
                    <Dumbbell className="mr-2 h-4 w-4" />
                    총 {(isEditing ? editedExercises : data.exercises).length}개 운동
                </Badge>

            </div>

            <div className="relative">
                <div
                    ref={scrollContainerRef}
                    className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 "
                    onScroll={handleScroll}
                >
                    {(isEditing ? editedExercises : data.exercises).length > 0 ? (
                        (isEditing ? editedExercises : data.exercises).map((exercise, index) => (
                            <Card key={exercise._id} className="overflow-hidden transition-all hover:shadow-md ">
                                {/* 헤더 영역 */}
                                <div className="flex items-center  m-4 mb-0 bg-zinc-100 dark:bg-zinc-600/30 p-2 rounded-md">
                                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <Dumbbell className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 ">
                                            <h3 className="font-medium ">{exercise.exerciseId.title}</h3>
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger asChild>
                                                    <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-xs">
                                                    <p>{exercise.exerciseId.description || '설명 없음'}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                        <div className='flex flex-wrap items-center gap-2 mt-1  overflow-hidden'>
                                            {exercise.exerciseId.tags?.map((tag: any) => (
                                                <p key={tag} className="text-xs text-zinc-600 dark:text-zinc-300 truncate">{tag}</p>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1  text-xs font-semibold">
                                            #{index + 1}
                                        </span>
                                        {/* 카드 액션 버튼 - 편집 모드일 때만 표시 */}
                                        {isEditing && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleRemoveExercise(exercise._id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">삭제</span>
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* 카드 내용 */}
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        {/* 세트 */}
                                        <div
                                            className={`text-center p-3 rounded-lg bg-zinc-100 dark:bg-zinc-600/30`}
                                        >
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                <Layers className="h-4 w-4 text-gray-500" />
                                                <p className="text-sm   text-zinc-700 dark:text-zinc-300">세트</p>
                                            </div>
                                            {isEditing ? (
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={exercise.sets ?? 1}
                                                    onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                                                    className="w-full text-center mt-1"
                                                    aria-label="세트 수"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center">
                                                    <p className="text-lg font-semibold">{exercise.sets}</p>
                                                    {/*  db 수정해서 prevSets 추가하기 그리고 api도 수정해야함 그럼 이거 주석 풀기
                                                    {exercise.prevSets && exercise.sets > exercise.prevSets && (
                                                        <TrendingUp className="ml-1 h-3 w-3 text-green-500" />
                                                    )}
                                                        */}
                                                </div>
                                            )}
                                        </div>

                                        {/* 반복 */}
                                        <div
                                            className={`text-center p-3 rounded-lg bg-zinc-100 dark:bg-zinc-600/30`}
                                        >
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                <Repeat className="h-4 w-4 text-gray-500" />
                                                <p className="text-sm  text-zinc-700 dark:text-zinc-300">반복</p>
                                            </div>
                                            {isEditing ? (
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={exercise.reps ?? 1}
                                                    onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value))}
                                                    className="w-full text-center mt-1"
                                                    aria-label="반복 횟수"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center">
                                                    <p className="text-lg font-semibold">{exercise.reps}</p>
                                                    {/*  db 수정해서 prevReps 추가하기 그리고 api도 수정해야함 그럼 이거 주석 풀기
                                                    {exercise.prevReps && exercise.reps > exercise.prevReps && (
                                                        <TrendingUp className="ml-1 h-3 w-3 text-green-500" />
                                                    )}
                                                        */}
                                                </div>
                                            )}
                                        </div>

                                        {/* 무게 */}
                                        <div
                                            className={`text-center p-3 rounded-lg ${getWeightClass(+exercise.weight)}`}
                                        >
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                <Weight className="h-4 w-4 text-gray-500" />
                                                <p className="text-sm   text-zinc-700 dark:text-zinc-300">무게</p>
                                            </div>
                                            {isEditing ? (
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.5"
                                                    value={exercise.weight ?? 1}
                                                    onChange={(e) => handleExerciseChange(index, 'weight', parseFloat(e.target.value))}
                                                    className="w-full text-center mt-1"
                                                    aria-label="무게 킬로그램"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center">
                                                    <p className="text-lg font-semibold pl-2">{exercise.weight}kg</p>

                                                    {/*  db 수정해서 prevWeight 추가하기 그리고 api도 수정해야함 그럼 이거 주석 풀기
                                                    {exercise.prevWeight && exercise.weight > exercise.prevWeight && (
                                                        <TrendingUp className="ml-1 h-3 w-3 text-green-500" />
                                                    )}
                                                        */}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>


                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <Dumbbell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-600">운동이 없습니다</h3>
                            <p className="text-sm text-gray-500 mt-2">새 운동을 추가해보세요</p>
                            <Button className="mt-4" variant="outline">
                                <PlusSquare className="mr-2 h-4 w-4" /> 운동 추가하기
                            </Button>
                        </div>
                    )}
                </div>

                {/* 스크롤 표시기 - 스크롤이 맨 아래가 아니고 운동이 3개 이상일 때만 표시 */}
                {!isScrolled && (isEditing ? editedExercises : data.exercises).length > 3 && (
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center py-2 pointer-events-none">
                        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm animate-bounce">
                            <ChevronsDown className="h-4 w-4 mr-1" /> 스크롤하여 더보기
                        </Badge>
                    </div>
                )}
            </div>

            <div className="mt-6">
                {isEditing ? (
                    <div className='flex justify-end gap-2'>
                        <Button variant='outline'
                            onClick={handleCancelEditing}
                            disabled={isPending}
                        >
                            <X className="mr-1 h-4 w-4" /> 취소
                        </Button>
                        <Button variant='default'
                            onClick={handleSaveChanges}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 저장 중...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-1 h-4 w-4" /> 저장하기
                                </>
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-center mt-8">
                        <DrawerDialogDemo planId={planId}>
                            <Button
                                variant="default"
                                className="flex items-center gap-2"
                                disabled={isPending || (data.exercises.length === 0)}
                            >
                                <Play className="h-4 w-4" /> 이 플랜으로 운동 시작하기
                            </Button>
                        </DrawerDialogDemo>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ExercisePlanDetailPage;