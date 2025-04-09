'use client'
import LoadingOverlay from '@/components/LayoutCompents/LoadingOverlay'
import LoadingSpinner from '@/components/LayoutCompents/LoadingSpinner'
import { DrawerDialogDone } from '@/components/LayoutCompents/ResponsiceDialog2'
import { Button } from '@/components/ui/button'
import { Card, CardDescription } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import { useActionExerciseSession, useEditExerciseSession } from '@/server/mutations'
import { ExerciseSession } from '@/utils/util'
import React, { useState } from 'react'


interface InProgressTProps {
    data: ExerciseSession;
    sessionId: string;
    isPending: boolean;
    handleDone: () => void;
}
const InProgressTap = ({ data, sessionId, isPending, handleDone }: InProgressTProps) => {
    const [loadingIndex, setLoadingIndex] = useState<string | null>(null);
    const [editingSetId, setEditingSetId] = useState<string | null>(null);
    const [editedReps, setEditedReps] = useState<number>(0);
    const [editedWeight, setEditedWeight] = useState<number>(0);

    const { mutateAsync: editSet } = useEditExerciseSession();
    const { mutate } = useActionExerciseSession();

    const handleEditClick = (setId: string, reps: number, weight: number) => {
        setEditingSetId(setId);
        setEditedReps(reps);
        setEditedWeight(weight);
    };

    const handleSave = async (exerciseId: string, sessionId: string, setId: string) => {
        setLoadingIndex(setId);
        await editSet({
            sessionId,
            exerciseId,
            setId,
            reps: editedReps,
            weight: editedWeight,
        });
        setLoadingIndex(null);
        setEditingSetId(null);
    };

    /** 세트 완료 버튼 클릭 시 호출되는 함수 */
    const handleNewSet = (exerciseId: string) => {
        if (!data) return;
        try {
            mutate({ sessionId, exerciseId, action: 'start' });
        } catch (error) {
            console.error(error);
            toast({ title: '오류 발생', description: '운동 상태를 업데이트하는 중 문제가 발생했습니다.' });
        }
    };

    /** 세트 종료 버튼 클릭 시 호출되는 함수 */
    const handleSetEnd = async (exerciseId: string) => {
        if (!data) return;
        try {
            mutate({ sessionId, exerciseId, action: 'end' });
        } catch (error) {
            console.error(error);
            toast({ title: '오류 발생', description: '운동 상태를 업데이트하는 중 문제가 발생했습니다.' });
        }
    };

    return (
        <TabsContent value="inProgress" className="space-y-2">
            {data.exercises.map(exercise => (
                exercise.state === 'inProgress' && (
                    <Card key={exercise._id} className="p-4 flex flex-col gap-2">
                        <div className="flex flex-col pb-4">
                            <span className="max-smc:truncate">{exercise.title}</span>
                            <CardDescription className="max-smc:truncate">
                                총 {exercise.sets}세트, 세트 당 최소 휴식시간: {exercise.rest}초
                            </CardDescription>
                        </div>
                        <div className="flex flex-col gap-2 h-[40vh] overflow-y-scroll">
                            {exercise.session.map((set, index) => (
                                <Card
                                    key={set._id}
                                    className={`flex justify-between items-center p-2 text-nowrap ${index === exercise.session.length - 1 ? 'border-2 border-red-400' : ''}`}
                                >
                                    {editingSetId === set._id ? (
                                        <div className='w-full flex justify-between items-center gap-2'>
                                            <p>{set.set}세트</p>
                                            <div>
                                                <input
                                                    type="number"
                                                    value={editedReps}
                                                    onChange={(e) => setEditedReps(Number(e.target.value))}
                                                    className="text-right w-fit min-w-[1ch] max-w-[5ch]"
                                                />
                                                회
                                            </div>
                                            <div>
                                                <input
                                                    type="number"
                                                    value={editedWeight}
                                                    onChange={(e) => setEditedWeight(Number(e.target.value))}
                                                    className="text-right w-fit min-w-[1ch] max-w-[5ch]"
                                                />
                                                kg
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant='destructive'
                                                    onClick={() => setEditingSetId(null)}
                                                >
                                                    취소
                                                </Button>

                                                <Button
                                                    variant='outline'
                                                    onClick={() => handleSave(exercise._id!, sessionId, set._id!)}
                                                >
                                                    저장 {loadingIndex === set._id && <LoadingSpinner className="w-5 h-5" />}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className='pl-2'>{set.set}세트</p>
                                            <Button variant="outline" onClick={() => handleEditClick(set._id!, set.reps, set.weight)}>{set.reps}회</Button>
                                            <Button variant="outline" onClick={() => handleEditClick(set._id!, set.reps, set.weight)}>{set.weight}kg</Button>

                                            <Button
                                                variant="outline"
                                                disabled={set.endTime !== undefined}
                                                onClick={() => handleSetEnd(exercise._id!)}
                                            >
                                                완료
                                            </Button>

                                        </>
                                    )}
                                </Card>
                            ))}
                            {exercise.session.length < exercise.sets ? (
                                exercise.session.at(-1)?.endTime && (
                                    <Button variant="outline" onClick={() => handleNewSet(exercise._id!)}>
                                        다음 세트 시작
                                    </Button>
                                )
                            ) : (
                                <Button variant="outline" onClick={handleDone}>
                                    마지막 세트 종료
                                </Button>
                            )}

                        </div>
                    </Card>
                )
            ))}

            {!data.exercises.find(ex => ex.state === 'inProgress') ? (
                <div className="text-center">진행중인 운동이 없습니다.</div>
            ) : (
                <DrawerDialogDone onComplete={handleDone}>
                    <Button className="flex-1">운동 종료</Button>
                </DrawerDialogDone>
            )}

            {isPending && <LoadingOverlay isLoading={isPending} text={'서버에 저장 중...'} />} {/* ✅ 로딩 오버레이 */}
        </TabsContent>
    )
}

export default InProgressTap