import LoadingSpinner from '@/components/LayoutCompents/LoadingSpinner'
import { DrawerDialogDone } from '@/components/LayoutCompents/ResponsiceDialog2'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Progress } from '@/components/ui/progress'
import { TabsContent } from '@/components/ui/tabs'
import { useEditExerciseSession } from '@/server/mutations'
import { ExerciseSession } from '@/utils/util'
import { Pause, Play } from 'lucide-react'
import React, { useState } from 'react'
interface InProgressTapProps {
    data: ExerciseSession | undefined;
    currentExercise: string | undefined;
    loading: boolean;
    isRunning: boolean;
    isResting: boolean;
    progress: number;
    restTime: number;
    formattedTime: string;
    handleStartRest: () => void;
    handleSkipRest: () => void;
    handleDone: () => void;
    toggleRunning: () => void;
}

const InProgressTap = ({
    data,
    currentExercise,
    loading,
    isRunning,
    isResting,
    progress,
    restTime,
    formattedTime,
    handleStartRest,
    handleSkipRest,
    handleDone,
    toggleRunning
}: InProgressTapProps) => {
    const [editingIndex, setEditingIndex] = useState<string | undefined>(undefined);
    const [editedReps, setEditedReps] = useState<number>(0);
    const [editedWeight, setEditedWeight] = useState<number>(0);
    const useEditExerciseSessionMutation = useEditExerciseSession();
    const handleEdit = (index: string | undefined) => {
        if (!index) return;
        const session = data?.exercises.find((exercise) => exercise._id === currentExercise)?.session.find((session) => session._id === index);
        // console.log(session);
        if (session?._id === index) {
            // console.log('edit')
            setEditingIndex(index);
            setEditedReps(session.reps);
            setEditedWeight(session.weight);
        }

    };

    const handleSave = () => {
        // console.log('save')
        if (!currentExercise || !editingIndex) return;
        useEditExerciseSessionMutation.mutate({
            sessionId: data?._id,
            exerciseId: currentExercise,
            detailSessionId: editingIndex,
            reps: editedReps,
            weight: editedWeight
        });
        setEditingIndex(undefined);
    };

    return (

        <TabsContent value="inProgress" className="space-y-2">
            <div className="space-y-2">
                {data?.exercises.map((exercise) => (
                    exercise._id === currentExercise && exercise.state === 'inProgress' &&
                    <Card key={exercise._id} className="p-4 flex  flex-col gap-2 ">
                        <div className='flex flex-col pb-4'>
                            <span className={` max-smc:truncate max-smc:w-32`}>{exercise.title}</span>
                            <CardDescription className={`max-smc:truncate max-smc:w-32`}> 총 {exercise.sets}세트, 세트 당 최소 휴식시간: {exercise.rest}초</CardDescription>
                        </div>
                        <div className='flex  flex-col gap-2 h-[40vh] overflow-y-scroll'>
                            {exercise.session.map((session, index) => (
                                <Card key={session._id} className='flex justify-between items-center p-2 text-nowrap'>
                                    {editingIndex === session._id ? (<>
                                        <div className='w-full flex justify-between items-center gap-2'>
                                            <div>
                                                {session.set}세트
                                            </div>
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
                                            <Button variant='outline' onClick={handleSave} >저장</Button>
                                        </div>
                                    </>) : (<>

                                        <span >{session.set}세트</span>

                                        <Button variant='outline' onClick={() => handleEdit(session._id)}>{session.reps}회</Button>
                                        <Button variant='outline' onClick={() => handleEdit(session._id)}>{session.weight}kg</Button>
                                        <Button
                                            variant="outline"
                                            disabled={index !== exercise.session.length - 1 || loading || !isRunning || isResting}
                                            onClick={handleStartRest}
                                            className={
                                                index !== exercise.session.length - 1
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }
                                        > {
                                                loading
                                                    ? <LoadingSpinner />
                                                    : (index !== exercise.session.length - 1)
                                                        ? '완료'
                                                        : (exercise.session.length === 1)
                                                            ? (!isRunning ? '계속' : isResting ? '휴식 중' : '운동 중')
                                                            : (!isRunning ? '계속' : isResting ? '휴식 중' : '운동 중')
                                            }
                                        </Button>
                                    </>)}

                                </Card>
                            ))}
                        </div>
                    </Card>
                ))}
                {!currentExercise && <div className='text-center'>진행 중인 운동이 없습니다.</div>}
            </div>
            {isResting && (
                <div className="flex flex-col items-center gap-2">
                    <Progress value={progress} className="w-full max-w-md  " ></Progress>
                    <div className='flex flex-row items-center gap-2'>
                        <p>남은 휴식 시간: {restTime}초</p>
                        <Button onClick={handleSkipRest} variant='outline' className=' rounded-2xl'>
                            건너뛰기
                        </Button>
                    </div>
                </div>
            )}
            <div className="text-center space-y-2 ">
                <Card className="text-2xl py-3 space-y-2 flex  flex-col">
                    <CardDescription>
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <Button variant="link">시간</Button>
                            </HoverCardTrigger>
                            <HoverCardContent>
                                휴식시간과 운동시간을 합산한 시간입니다.
                            </HoverCardContent>
                        </HoverCard>
                    </CardDescription>
                    <CardTitle>{formattedTime}</CardTitle>
                </Card>
                <Card className="p-4 space-x-2 flex">
                    <Button
                        onClick={toggleRunning}
                        disabled={!currentExercise}
                        className={`${isRunning ? 'bg-red-600 hover:bg-red-600/80' : 'bg-green-500'} flex-1`}
                    >
                        {isRunning ? <>
                            <Pause />
                            일시정지</> : <>
                            <Play />
                            계속</>}

                    </Button>
                    <DrawerDialogDone onComplete={handleDone}>
                        <Button
                            disabled={!currentExercise}
                            className="flex-1"
                        >
                            운동 종료
                        </Button>
                    </DrawerDialogDone>
                </Card>
            </div>
        </TabsContent>


    )
}

export default InProgressTap