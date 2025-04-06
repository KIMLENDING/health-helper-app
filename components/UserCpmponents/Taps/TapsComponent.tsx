'use client'
import { use, useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import { ExerciseOptionSession, ExerciseSession } from '@/utils/util'
import { useGetExerciseSession } from '@/server/queries'
import { Card, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { useActionExerciseSession } from '@/server/mutations'
import LoadingSpinner from '@/components/LayoutCompents/LoadingSpinner'

const TapsComponent = ({ sessionId }: { sessionId: string }) => {
    const [activeTab, setActiveTab] = useState("list");
    const [loading, setLoading] = useState<boolean[]>([]); // 로딩 상태
    const { data, error, isLoading } = useGetExerciseSession(sessionId); // 운동 세션 조회
    const useActionExerciseSessionMutation = useActionExerciseSession(); // 특정 운동 세션 상태 변경
    useEffect(() => {
        setLoading(Array(data?.exercises.length).fill(false))
    }, [])
    console.log(data?.exercises.map(exercise => exercise.state))
    // 각각의 exercise.state에 따라 버튼의 상태를 다르게 설정
    const handleExerciseStart = async (exercise: ExerciseOptionSession) => {
        // 운동 선택시 상태 변경
        // 진행중인 운동이 있으면 다른 운동을 시작하지 못하게 막음
        if (!data) return;
        try {
            // 로딩 상태 변경
            setLoading((prev) => {
                const newLoading = [...prev];
                const index = data.exercises.findIndex((e) => e._id === exercise._id);
                if (index !== undefined && index !== -1) {
                    newLoading[index] = true; // 로딩 상태 변경
                }
                return newLoading;
            })

            if (!exercise._id) return;
            const hasInProgress = data?.exercises.some((exercise) => exercise.state === 'inProgress');
            if (hasInProgress) {
                toast({
                    variant: 'destructive',
                    title: "이미 진행중인 운동이 있습니다.",
                    description: "다른 운동을 진행하기 전에 현재 운동을 완료해주세요.",
                });
                return;
            }
            // 진행중인 운동이 없으면 선택한 운동을 시작
            // 현재 세트를 가져와서 새로운 세트 생성 



            // 서버에 운동의 상태를 변경하고 첫 세션을 생성
            const res = await useActionExerciseSessionMutation.mutateAsync({ sessionId, exerciseId: exercise._id, action: 'start' }); // 운동 시작

            if (res) {
                toast({
                    title: `${exercise.title}이(가) 3초 후에 운동이 시작 됩니다. `,
                    description: "1 세트 시작",
                });
                localStorage.removeItem('rest_time'); // 로컬 스토리지 초기화 (휴식 시간간)
                localStorage.removeItem('isResting'); // 로컬 스토리지 초기화 (휴식 상태)
                localStorage.removeItem('stopwatch_running'); // 로컬 스토리지 초기화 (운동 상태)
                localStorage.removeItem("elapsed_time");  // 로컬 스토리지 초기화 (경과 시간)
                localStorage.removeItem("start_time");  // 로컬 스토리지 초기화 (시작 시간)
                setActiveTab('inProgress'); // 탭 변경
                // reset(); // 타이머 초기화
                // setShowCountdown(true); // 카운트 다운 시작 -> <CountdownOverlay /> 컴포넌트 실행 후 handleCountdownComplete가 실행됨 그럼 toggleRunning이 실행됨
            }
        } catch (error) {
            console.error(error); // 에러 로깅
            toast({
                title: "오류 발생",
                description: "운동 상태를 업데이트하는 중 문제가 발생했습니다.",
            });
        } finally {

            // 로딩 상태 변경
            setLoading((prev) => {
                const newLoading = [...prev];
                const index = data.exercises.findIndex((e) => e._id === exercise._id);
                if (index !== undefined && index !== -1) {
                    newLoading[index] = false; // 로딩 상태 변경
                }
                return newLoading;
            });
        }
    }
    if (isLoading || !data) return <div className='text-center'>Loading...</div>
    if (error) return <div className='text-center'>Error: {error.message}</div>
    return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
                <TabsTrigger value="list" className="flex-1">
                    목록 ({data.exercises?.length})
                </TabsTrigger>
                <TabsTrigger value="inProgress" className="flex-1">
                    진행중 (1)
                </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className='space-y-2'>
                <div className="space-y-2 max-h-[64vh] overflow-y-scroll">
                    {data.exercises.map((exercise, index) => {
                        return (
                            <Card key={exercise._id} className="p-4 flex justify-between items-center">
                                <div className='flex flex-col'>
                                    <span className={` max-smc:truncate `}>{exercise.title}</span>
                                    <CardDescription className={` max-smc:truncate `}> {exercise.sets}세트, 휴식시간: {exercise.rest}초</CardDescription>
                                </div>
                                <Button
                                    onClick={() => handleExerciseStart(exercise)}
                                    variant="outline"
                                    disabled={
                                        exercise.state === 'done' ||
                                        (exercise.state === 'pending' && data.exercises.some(e => e.state === 'inProgress'))
                                    }
                                >
                                    {exercise.state === 'pending' && '시작'}
                                    {exercise.state === 'inProgress' && '완료'}
                                    {exercise.state === 'done' && '완료됨'}
                                    {loading[index] && <LoadingSpinner className='w-5 h-5' />}
                                </Button>
                            </Card>
                        )
                    })}
                </div>
                <div className='flex-1 flex justify-center py-2   '>
                    {/* <Button variant='default' onClick={handleAllDone} >{allDone ? '운동 완료' : '운동 종료'}</Button> */}
                </div>
            </TabsContent>


        </Tabs>
    )
}

export default TapsComponent