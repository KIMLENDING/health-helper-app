'use client'
import { useGetExerciseSession } from '@/server/queries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle, } from '@/components/ui/card';
import { ExerciseOptionSession, ExercisesessionData } from '@/utils/util';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LayoutCompents/LoadingSpinner';
import { useStateChangeExerciseSession } from '@/server/mutations';
import { useStopwatch } from '@/hooks/use-stopwatch';
import CountdownOverlay from '@/components/LayoutCompents/CountdownOverlay';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { DrawerDialogDone } from '@/components/LayoutCompents/ResponsiceDialog2';
import { Progress } from '@/components/ui/progress';

const Page = () => {
    const { sessionId } = useParams() as { sessionId: string };
    const [activeTab, setActiveTab] = useState("list");
    const { data, error, isLoading } = useGetExerciseSession(sessionId);
    const useStateChangeExerciseSessionMutation = useStateChangeExerciseSession(); // 선택한 운동 상태 변경 후 운동 시작 mutation
    const [sessionData, setSessionData] = useState<ExercisesessionData | undefined>(); // 진행 중인 세트의 세션 데이터를 관리하는 상태 {set, reps, weight}
    const [currentExercise, setCurrentExercise] = useState<string | undefined>(); // 현재 진행중인 운동의 id
    const [loading, setLoading] = useState(false); // mutation loading 상태
    const { time, formattedTime, isRunning, toggleRunning, reset } = useStopwatch(); // 타이머
    const [showCountdown, setShowCountdown] = useState(false);// 운동 시작 전 카운트 다운

    const [progress, setProgress] = useState<number>(0); // 진행률
    const [restTime, setRestTime] = useState<number>(() => {
        // 초기 값으로 로컬 스토리지에서 시간 복원
        const savedTime = localStorage.getItem('rest_time');
        return savedTime ? parseInt(savedTime, 10) : 0;
    }); // 기본 휴식 시간
    const [isResting, setIsResting] = useState(() => {
        // 초기 값으로 로컬 스토리지에서 실행 상태 복원
        const savedRunningState = localStorage.getItem('isResting');
        return savedRunningState === 'true';
    }); // 휴식 상태 관리
    const timerRef = useRef<NodeJS.Timeout | null>(null);



    const handleUpdate = async (exercise: ExerciseOptionSession) => {
        // 운동 선택시 상태 변경
        // 진행중인 운동이 있으면 다른 운동을 시작하지 못하게 막음
        try {
            setLoading(true); // 로딩 시작
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
            const set = data?.exercises.find((Exercise) => Exercise._id === exercise._id)?.session.length || 0; //기본적으로 0이 나올 것임 처음 시작하는 운동이기 때문
            const newSessionData = { set: set + 1, reps: 8, weight: 25 }
            // 서버에 운동의 상태를 변경하고 첫 세션을 생성
            const res = await useStateChangeExerciseSessionMutation.mutateAsync({ sessionId, exerciseId: exercise._id, state: 'inProgress', sessionData: newSessionData }); // 운동 시작

            if (res) {
                toast({
                    title: `${exercise.title}이(가) 3초 후에 운동이 시작 됩니다. `,
                    description: "1 세트 시작",
                });
                setActiveTab('inProgress');
                setShowCountdown(true); // 카운트 다운 시작 -> <CountdownOverlay /> 컴포넌트 실행 후 handleCountdownComplete가 실행됨 그럼 toggleRunning이 실행됨
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

    const handleDone = async () => {
        // 강제 운동 종료
        if (!currentExercise) return;
        try {
            setLoading(true); // 로딩 시작
            const res = await useStateChangeExerciseSessionMutation.mutateAsync({ sessionId, exerciseId: currentExercise, state: 'done', repTime: time });
            const tmp = data?.exercises.find((Exercise) => Exercise._id === currentExercise)?.title;
            if (res && tmp) {
                toast({
                    title: `${tmp} 완료 `,
                });
                toggleRunning(); // 타이머 종료
                reset(); // 타이머 초기화
                setSessionData(undefined); // 세션 데이터 초기화
                setCurrentExercise(undefined); // 현재 운동 초기화
                setActiveTab('list');
                return;
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
                const res = await useStateChangeExerciseSessionMutation.mutateAsync({ sessionId, exerciseId: exercise._id!, state: 'done', repTime: time });
                if (res) {
                    toast({
                        title: `${exercise.title} 완료 `,
                    });
                    toggleRunning(); // 타이머 종료
                    reset(); // 타이머 초기화
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

    const handleCountdownComplete = () => { // 카운트 다운이 끝나면 실행
        setShowCountdown(false);
        toggleRunning(); // 타이머 시작
    };

    const handleSkipRest = () => {
        //isRunning이 false이면 스킵 버튼 비활성화 
        if (!isRunning) return;
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setRestTime(0); // 즉시 휴식 종료
        setIsResting(false);
        localStorage.removeItem('rest_time');
        localStorage.removeItem('isResting');
    };

    const handleStartRest = () => {
        // 휴식 시작
        if (!isRunning) return;
        setIsResting(true);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        toast({ title: "휴식시간!!", });
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
            if (isResting) {
                // 휴식 중이면 휴식 시간을 로컬 스토리지에서 가져와서 설정
                const savedTime = localStorage.getItem('rest_time');
                setRestTime(savedTime ? parseInt(savedTime, 10) : 0);
            } else {
                const defaultRestTime = data?.exercises.find((Exercise) => Exercise._id === currentExercise)?.rest || 60;
                setRestTime(defaultRestTime); // 기본 휴식 시간 설정
            }

            setSessionData(newSessionData);
        }
    }, [currentExercise, data])  // 새로고침시 데이터가 바뀔때마다 실행


    useEffect(() => {
        if (isRunning) {
            // 타이머 실행
            if (isResting && restTime > 0 && !timerRef.current) {
                timerRef.current = setInterval(() => {

                    setRestTime((prev) => {
                        const updatedTime = Math.max(prev - 1, 0);
                        localStorage.setItem('rest_time', updatedTime.toString()); // 시간 저장
                        return updatedTime;
                    });
                }, 1000);
            }
        } else {
            // 타이머 중지
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
        const defaultRestTime = data?.exercises.find((Exercise) => Exercise._id === currentExercise)?.rest || 60;
        setProgress(Math.min((restTime / defaultRestTime) * 100, 100));
        // 타이머 종료 시 정리
        if (restTime === 0) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            handleSessionData(data?.exercises.find((exercise) => exercise._id === currentExercise)!);
            setIsResting(false);
            localStorage.removeItem('rest_time');
            localStorage.removeItem('isResting');
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isRunning, restTime, isResting]);



    useEffect(() => {
        const defaultRestTime = data?.exercises.find((Exercise) => Exercise._id === currentExercise)?.rest || 60;
        const calculateProgress = () => {
            const newProgress = Math.min((restTime / defaultRestTime) * 100, 100);
            setProgress(prevProgress => {
                // 부드러운 전환을 위해 점진적 변화 적용
                const smoothedProgress = prevProgress + (newProgress - prevProgress) * 0.3;
                return Math.round(smoothedProgress);
            });
        };

        // 애니메이션 프레임을 사용한 부드러운 업데이트
        const animationFrame = requestAnimationFrame(calculateProgress);

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [progress])

    useEffect(() => {
        // isResting 상태 변경 시 로컬 스토리지에 저장
        if (isResting) { // 휴식 중일때만 저장
            localStorage.setItem('isResting', isResting.toString());
        }
    }, [isResting]);

    if (isLoading) return <div className='flex-1 flex items-center justify-center'><LoadingSpinner /></div>
    if (error) return <div>에러 발생</div>

    return (
        <div className='mx-auto w-full h-full   flex-1 max-w-3xl rounded-xl p-4'>
            {showCountdown && (
                <CountdownOverlay onComplete={handleCountdownComplete} />
            )}
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
                                        {loading ? <LoadingSpinner /> : exercise.state === 'pending' ? '시작' : exercise.state === 'inProgress' ? '진행중' : '완료'}
                                    </Button>
                                </Card>
                            )
                        })}
                    </div>
                </TabsContent>

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
                                        <Card key={index} className='flex justify-between items-center p-2 text-nowrap'>
                                            <span >{session.set}세트</span>
                                            <span>{session.reps}회</span>
                                            <span>{session.weight}kg</span>
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
                                {isRunning ? '일시정지' : '계속'}
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
            </Tabs>
        </div>
    )
}

export default Page
