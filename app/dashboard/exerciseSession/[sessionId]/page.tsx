'use client'
import { useGetExerciseSession } from '@/server/queries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Card, CardDescription, } from '@/components/ui/card';
import { ExerciseOptionSession, ExercisesessionData } from '@/utils/util';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LayoutCompents/LoadingSpinner';
import { useStateChangeExerciseSession } from '@/server/mutations';

const Page = () => {
    const { sessionId } = useParams() as { sessionId: string };
    const [activeTab, setActiveTab] = useState("list");
    const { data, error, isLoading } = useGetExerciseSession(sessionId);
    const useStateChangeExerciseSessionMutation = useStateChangeExerciseSession(); // 선택한 운동 상태 변경 후 운동 시작 mutation
    const [sessionData, setSessionData] = useState<ExercisesessionData | undefined>(); // 세션 데이터
    const [currentExercise, setCurrentExercise] = useState<string | undefined>(); // 현재 진행중인 운동의 id
    const [loading, setLoading] = useState(false); // mutation loading 상태
    const handleUpdate = async (exercise: ExerciseOptionSession) => {
        // 운동 선택시 상태 변경
        // 진행중인 운동이 있으면 다른 운동을 시작하지 못하게 막음
        try {
            setLoading(true); // 로딩 시작
            if (!exercise._id) return;
            const hasInProgress = data?.exercises.some((exercise) => exercise.state === 'inProgress');
            if (hasInProgress) {
                toast({
                    title: "이미 진행중인 운동이 있습니다.",
                    description: "다른 운동을 진행하기 전에 현재 운동을 완료해주세요.",
                });
                return;
            }
            // 진행중인 운동이 없으면 선택한 운동을 시작
            // 현재 세트를 가져와서 새로운 세트 생성 
            const set = data?.exercises.find((Exercise) => Exercise._id === exercise._id)?.session.length || 0; //기본적으로 0이 나올 것임 처음 시작하는 운동이기 때문
            const newSessionData = { set: set + 1, reps: 8, weight: 25 }
            // 서버에 운동의 상태를 변경하고 첫 세션을 생성
            const res = await useStateChangeExerciseSessionMutation.mutateAsync({ sessionId, exerciseId: exercise._id, state: 'inProgress', sessionData: newSessionData }); // 운동 시작
            if (res) {
                toast({
                    title: `${exercise.title} 시작`,
                    description: "1 세트 시작",
                });
                setActiveTab('inProgress');
            }
        } catch (error) {
            console.error(error); // 에러 로깅
            toast({
                title: "오류 발생",
                description: "운동 상태를 업데이트하는 중 문제가 발생했습니다.",
            });
        } finally {
            setLoading(false); // 로딩 종료
        }
    }

    const handleSessionData = async (exercise: ExerciseOptionSession) => {
        // 세트 완료시 세션 데이터 업데이트
        try {
            setLoading(true); // 로딩 시작
            if (!sessionData) return;
            if (sessionData?.set >= exercise.sets) {
                // 마지막 세트일 경우 운동 완료
                const res = await useStateChangeExerciseSessionMutation.mutateAsync({ sessionId, exerciseId: exercise._id!, state: 'done', });
                if (res) {
                    toast({
                        title: `${exercise.title} 완료 `,
                    });
                    setSessionData(undefined); // 세션 데이터 초기화
                    setCurrentExercise(undefined); // 현재 운동 초기화
                    setActiveTab('list');
                    return;
                }
            }
            // 마지막 세트가 아닐 경우 다음 세트 생성
            //sessionData를 직접 사용하지 않는 이유는 새로고침시 초기화 되기 때문
            const set = data?.exercises.find((Exercise) => Exercise._id === exercise._id)?.session.length || 0;
            const newSessionData = { set: set + 1, reps: 8, weight: 25 } // 새 세트 생성
            setSessionData(newSessionData); // 상태 업데이트
            // 새 세트 생성
            const res = await useStateChangeExerciseSessionMutation.mutateAsync({ sessionId, exerciseId: exercise._id!, state: 'inProgress', sessionData: newSessionData });
            if (res) {
                toast({ title: `${newSessionData?.set} 세트 시작` });
            }
        } catch (error) {
            console.error(error); // 에러 로깅
            toast({
                title: "오류 발생",
                description: "운동 상태를 업데이트하는 중 문제가 발생했습니다.",
            });
        } finally {
            setLoading(false); // 로딩 종료
        }
    }


    useEffect(() => {
        if (data) {
            // 진행중인 운동이 있으면 해당 운동의 id를 저장
            const inProgressExercise = data.exercises.find((exercise) => exercise.state === 'inProgress');
            if (inProgressExercise) {
                setCurrentExercise(inProgressExercise._id);
            } else {
                setCurrentExercise(undefined);
            }
        }
    }, [data]) // 새로고침시 데이터가 바뀔때마다 실행

    useEffect(() => {
        // 초기 세션 데이터 설정
        if (data) {
            const set = data?.exercises.find((exercise) => exercise._id === currentExercise)?.session.length || 0;
            const newSessionData = { set: set, reps: 8, weight: 25 }
            setSessionData(newSessionData);
        }
    }, [currentExercise, data])  // 새로고침시 데이터가 바뀔때마다 실행

    if (isLoading) return <div className='flex-1 flex items-center justify-center'><LoadingSpinner /></div>
    if (error) return <div>에러 발생</div>

    return (
        <div className='mx-auto w-full max-w-3xl rounded-xl p-4'>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mb-4">
                    <TabsTrigger value="list" className="flex-1">
                        목록 ({data?.exercises.length})
                    </TabsTrigger>
                    <TabsTrigger value="inProgress" className="flex-1">
                        진행중 ({currentExercise ? 1 : 0})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <div className="space-y-2">
                        {data?.exercises.map((exercise) => {
                            return (
                                <Card key={exercise._id} className="p-4 flex justify-between items-center">
                                    <div className='flex flex-col'>
                                        <span className={` max-smc:truncate max-smc:w-32`}>{exercise.title}</span>
                                        <CardDescription className={` max-smc:truncate max-smc:w-32`}> {exercise.sets}세트, 휴식시간: {exercise.rest}초</CardDescription>
                                    </div>

                                    <Button
                                        onClick={() => handleUpdate(exercise!)}
                                        variant="outline"
                                        disabled={exercise.state !== 'pending'}
                                    >
                                        {loading ? <LoadingSpinner /> : exercise.state}
                                    </Button>
                                </Card>
                            )
                        })}
                    </div>
                </TabsContent>

                <TabsContent value="inProgress">
                    <div className="space-y-2">
                        {data?.exercises.map((exercise) => (
                            exercise._id === currentExercise && exercise.state === 'inProgress' &&
                            <Card key={exercise._id} className="p-4 flex  flex-col gap-2">
                                <div className='flex flex-col'>
                                    <span className={` max-smc:truncate max-smc:w-32`}>{exercise.title}</span>
                                    <CardDescription className={` max-smc:truncate max-smc:w-32`}> 총 {exercise.sets}세트, 세트 당 휴식시간: {exercise.rest}초</CardDescription>
                                </div>
                                {exercise.session.map((session, index) => (
                                    <Card key={session.set} className='flex justify-between items-center p-2 text-nowrap'>
                                        <span >{session.set}세트</span>
                                        <span>{session.reps}회</span>
                                        <span>{session.weight}kg</span>
                                        <Button
                                            variant="outline"
                                            disabled={index !== exercise.session.length - 1}
                                            onClick={() => handleSessionData(exercise)}
                                            className={
                                                index !== exercise.session.length - 1
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }
                                        > {loading ? <LoadingSpinner /> : ' 세트 완료'}

                                        </Button>
                                    </Card>
                                ))}

                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>


        </div>
    )
}

export default Page

// {
//     "_id": "6745e3b13420bee28797a39b",
//     "userId": "67345ef1455c5969e9cd4001",
//     "exercisePlanId": "6737ce6afe6dba3f09bc2504",
//     "exercises": [
//         {
//             "exerciseId": "672fc04c5052576f4db1b64a",
//             "title": "운동",
//             "sets": 4,
//             "rest": 60,
//             "state": "pending",
//             "_id": "6745e3b13420bee28797a39c",
//             "session": []
//         },
//         {
//             "exerciseId": "672fc1d35052576f4db1b64e",
//             "title": "밴치 프레스",
//             "sets": 4,
//             "rest": 60,
//             "state": "pending",
//             "_id": "6745e3b13420bee28797a39d",
//             "session": []
//         },
//     ],
//     "state": "pending",
//     "createdAt": "2024-11-26T15:05:21.328Z",
//     "updatedAt": "2024-11-26T15:05:21.328Z",
//     "__v": 0
// }