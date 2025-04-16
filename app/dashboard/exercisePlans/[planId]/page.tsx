'use client';
import LoadingOverlay from '@/components/LayoutCompents/LoadingOverlay';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Save, X, Edit, Check, Trash2, PlusSquare } from 'lucide-react';
import { useExercisePlanById } from '@/server/queries';
import { useEditPlan } from '@/server/mutations';
import React, { use, useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DrawerDialogDemo } from '@/components/LayoutCompents/ResponsiveDialog';

/** 플랜 세부 CRUD 페이지 */
type Params = Promise<{ planId: string }>;

const ExercisePlanDetailPage = (props: {
    params: Params;
}) => {
    const params = use(props.params);
    const planId = params.planId;
    const { data } = useExercisePlanById(planId);
    const { mutateAsync, isPending } = useEditPlan();

    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedExercises, setEditedExercises] = useState<any[]>([]);

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
        const updatedData = {
            exercisePlanId: planId,
            title: editedTitle,
            exercises: editedExercises.map(ex => ({
                _id: ex._id,
                exerciseId: ex.exerciseId,
                sets: ex.sets,
                reps: ex.reps,
                weight: ex.weight
            }))
        };

        await mutateAsync(updatedData);
        setIsEditing(false);
    };
    // 플랜 삭제
    const handleDeletePlan = async () => {
        // 삭제 로직 추가
    };


    if (isPending) return <LoadingOverlay isLoading={isPending} text={'처리 중...'} />;

    if (!data) return <div className="p-8 text-center">운동 계획을 찾을 수 없습니다.</div>;

    return (
        <section className='mx-auto w-full max-w-3xl p-4'>
            <div className="mb-6 flex items-center justify-between gap-2">
                {isEditing ? (
                    <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="text-xl font-bold"
                    />
                ) : (
                    <h1 className="text-2xl font-bold">{data.title}</h1>
                )}
                <Badge variant="outline" className="px-3 py-1 shrink-0">
                    {formatDate(data.createdAt!)}
                </Badge>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide">
                {(isEditing ? editedExercises : data.exercises).map((exercise, index) => (
                    <Card key={exercise._id} className="overflow-hidden">
                        <div className="flex items-center border-b p-4">
                            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <Dumbbell className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">{exercise.title}</h3>
                            </div>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-400">운동 {index + 1}</span>
                        </div>

                        <CardContent className="p-4">
                            <div className="flex justify-between">
                                <div className="text-center">
                                    <p className="text-sm text-gray-700 dark:text-gray-400">세트</p>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            min="1"
                                            value={exercise.sets}
                                            onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                                            className="w-16 text-center "
                                        />
                                    ) : (
                                        <p className="text-lg font-semibold ">{exercise.sets}</p>
                                    )}
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-700 dark:text-gray-400">반복</p>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            min="1"
                                            value={exercise.reps}
                                            onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value))}
                                            className="w-16 text-center "
                                        />
                                    ) : (
                                        <p className="text-lg font-semibold">{exercise.reps}</p>
                                    )}
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-700 dark:text-gray-400">무게 (kg)</p>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={exercise.weight}
                                            onChange={(e) => handleExerciseChange(index, 'weight', parseFloat(e.target.value))}
                                            className="w-16 text-center   "
                                        />
                                    ) : (
                                        <p className="text-lg font-semibold">{exercise.weight}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-6 ">
                {isEditing ? (
                    <div className='flex justify-end gap-2'>
                        <Button variant='default'

                            onClick={handleCancelEditing}
                            disabled={isPending}
                        >
                            <X className="mr-1 h-4 w-4" /> 취소
                        </Button>
                        <Button variant='default'

                            onClick={handleSaveChanges}
                            disabled={isPending}
                        >
                            {isPending ? '저장 중...' : (
                                <>
                                    <Save className="mr-1 h-4 w-4" /> 저장하기
                                </>
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="flex  flex-col-reverse items-end sm:flex-row sm:justify-between gap-2">
                        <div className='flex gap-2'>
                            <Button
                                variant='destructive'
                            >
                                <Trash2 className="mr-1 h-4 w-4" /> 삭제하기
                            </Button>
                            <Button
                                variant='addButton'
                            >
                                <PlusSquare className="mr-1 h-4 w-4" /> 운동 추가
                            </Button>

                            <Button
                                variant='default'

                                disabled={isPending}
                                onClick={handleStartEditing}
                            >
                                <Edit className="mr-1 h-4 w-4" /> 수정하기
                            </Button>
                            <DrawerDialogDemo planId={planId}>
                                <Button variant='default'
                                >
                                    <Check className="mr-1 h-4 w-4" /> 운동 시작
                                </Button>
                            </DrawerDialogDemo>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ExercisePlanDetailPage;