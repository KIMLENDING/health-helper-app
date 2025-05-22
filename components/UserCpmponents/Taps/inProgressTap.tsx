'use client'
import LoadingOverlay from '@/components/LayoutCompents/LoadingOverlay'
import LoadingSpinner from '@/components/LayoutCompents/LoadingSpinner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TabsContent } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import { useActionExerciseSession, useEditExerciseSession } from '@/server/user/exerciseSession/mutations'

import { ExerciseSession } from '@/utils/util'
import React, { useState } from 'react'
import { useDialogStore } from '@/store/dialogStore'
import { DrawerDialogActionWithStore } from '../DynamicComponents'


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
    const [addWeight, setAddWeight] = useState(5);
    // const [open, setOpen] = React.useState(false);

    const { mutateAsync: editSet } = useEditExerciseSession();
    const { mutate } = useActionExerciseSession();

    const { openDialog } = useDialogStore();
    const handleOpenDialog = () => {
        openDialog({
            title: '운동 종료',
            description: '운동을 종료하면 종료한 운동은 다시 시작할 수 없습니다.',
            onConfirm: handleDone,
        });
    };

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
            mutate({ sessionId, exerciseId, action: 'start', addWeight });
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
                        <div className="flex flex-col pb-4 gap-2">
                            <CardTitle className='flex justify-between items-center'>
                                <span className="max-smc:truncate">{exercise.exerciseId.title}</span>
                                <Popover>
                                    <PopoverTrigger><Badge variant='outline'>증가량: {addWeight}kg</Badge></PopoverTrigger>
                                    <PopoverContent className='flex flex-row justify-between items-center gap-2 '>
                                        <Label className='text-nowrap'>다음 세트 증가량</Label>
                                        <Input
                                            type="number"
                                            value={addWeight}
                                            min={0}
                                            onChange={(e) => setAddWeight(Number(e.target.value))}
                                            className="text-center w-fit min-w-[1ch] max-w-[10ch]"
                                            placeholder="5"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </CardTitle>

                            <CardDescription className="max-smc:truncate">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">시작시간: {new Date(exercise.session[0].createdAt!).toLocaleString()}</span>
                                    총 {exercise.sets}세트
                                </div>


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
                <div className='min-w-screen flex '>

                    <Button
                        variant="default"
                        className="flex-1"
                        disabled={isPending || (data.exercises.length === 0)}
                        onClick={() => {
                            // setOpen(true);
                            setTimeout(() => { handleOpenDialog(); }, 30); //포커스가 이동할 시간을 줘야함 그렇지 않으면 
                            //Blocked aria-hidden on an element because its descendant retained focus. 오류 발생함
                        }}
                    >
                        운동 종료
                    </Button>
                    {/* {open && <DrawerDialogActionWithStore />
                    } */}

                </div>

            )}

            {isPending && <LoadingOverlay isLoading={isPending} text={'서버에 저장 중...'} />} {/* ✅ 로딩 오버레이 */}
        </TabsContent>
    )
}

export default InProgressTap