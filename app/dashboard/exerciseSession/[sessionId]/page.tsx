'use client'
import { useParams, useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast';
import React, { useEffect, useState } from 'react'
import { useGetExerciseSession } from '@/server/queries';
import { useAllDoneExerciseSession, useStateChangeExerciseSession } from '@/server/mutations';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardDescription, } from '@/components/ui/card';
import { ExerciseOptionSession, ExercisesessionData } from '@/utils/util';

import LoadingSpinner from '@/components/LayoutCompents/LoadingSpinner';
import CountdownOverlay from '@/components/LayoutCompents/CountdownOverlay';
import InProgressTap from '@/components/UserCpmponents/Taps/inProgressTap';

import { useStopwatch } from '@/hooks/use-stopwatch3';
import { useRestTime } from '@/hooks/use-restTime2';
import LoadingOverlay from '@/components/LayoutCompents/LoadingOverlay';

const Page = () => {
    const { sessionId } = useParams() as { sessionId: string };
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("list");
    const { data, error, isLoading } = useGetExerciseSession(sessionId); // 세션 데이터 가져오기
    const [sessionData, setSessionData] = useState<ExercisesessionData | undefined>(); // 진행 중인 세트의 세션 데이터를 관리하는 상태 {set, reps, weight}
    const [currentExercise, setCurrentExercise] = useState<string | undefined>(); // 현재 진행중인 운동의 id
    const [loading, setLoading] = useState(false); // mutation loading 상태
    const { time, formattedTime, isRunning, toggleRunning, reset } = useStopwatch(); // 타이머
    const [showCountdown, setShowCountdown] = useState(false);// 운동 시작 전 카운트 다운
    const [defaultRestTime, setDefaultRestTime] = useState<number>(10000); // 기본 휴식 시간
    const [allDone, setAllDone] = useState(false); // 모든 운동이 완료되었는지 확인
    const { progress, restTime, isResting, setRestTime, setIsResting, handleSkipRest, handleStartRest } = useRestTime({ isRunning, defaultRestTime }); // 휴식 시간
    const useStateChangeExerciseSessionMutation = useStateChangeExerciseSession(); // 선택한 운동 상태 변경 후 운동 시작 mutation
    const useAllDoneExerciseSessionMutation = useAllDoneExerciseSession(); // 모든 운동 완료 mutation

    useEffect(() => {
        if (data?.state === 'done') {
            window.history.replaceState(null, "", "/dashboard");
            router.push('/dashboard');
        }
    }, [data?.state]);
    const handleAllDone = async () => {
        // 모든 운동 완료시 실행
        try {
            setLoading(true); // 로딩 시작
            localStorage.removeItem('rest_time'); // 로컬 스토리지 초기화 (휴식 시간)
            localStorage.removeItem('isResting'); // 로컬 스토리지 초기화 (휴식 상태)
            localStorage.removeItem('stopwatch_running'); // 로컬 스토리지 초기화 (운동 상태)
            localStorage.removeItem("elapsed_time");  // 로컬 스토리지 초기화 (경과 시간)
            localStorage.removeItem("start_time");  // 로컬 스토리지 초기화 (시작 시간)
            const res = await useAllDoneExerciseSessionMutation.mutateAsync({ sessionId });

            if (res.delete) { // 완료한 운동이 없어 세션을 제거했을 경우
                router.push('/dashboard');
                return;
            }
            if (res) {
                router.push(`/dashboard/detail/${sessionId}`); // 세션 완료 후 세션 상세 페이지로 이동  
                return;
            }
        } catch (error) {
            console.error(error); // 에러 로깅
            toast({
                title: "오류 발생",
                description: "모든 운동을 완료하는 중 문제가 발생했습니다.",
            });
        }
        finally {
            setLoading(false); // 로딩 종료
        }
    }

    const handleExerciseStart = async (exercise: ExerciseOptionSession) => {
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
                localStorage.removeItem('rest_time'); // 로컬 스토리지 초기화 (휴식 시간간)
                localStorage.removeItem('isResting'); // 로컬 스토리지 초기화 (휴식 상태)
                localStorage.removeItem('stopwatch_running'); // 로컬 스토리지 초기화 (운동 상태)
                localStorage.removeItem("elapsed_time");  // 로컬 스토리지 초기화 (경과 시간)
                localStorage.removeItem("start_time");  // 로컬 스토리지 초기화 (시작 시간)
                setActiveTab('inProgress'); // 탭 변경
                reset(); // 타이머 초기화
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

                setRestTime(0); // 휴식 종료
                setIsResting(false); // 휴식 상태 종료
                localStorage.removeItem('rest_time'); // 로컬 스토리지 초기화
                localStorage.removeItem('isResting'); // 로컬 스토리지 초기화

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
            const newSessionData = { set: sessionData.set + 1, reps: sessionData.reps, weight: sessionData.weight } // 새 세트 생성
            setSessionData(newSessionData); // 상태 업데이트 -> useEffect에서 따로 서버에서 query로 가져온 데이터를 업데이트 하는데 여기서 업데이트를 해주면 더 빠르긴 한데 중복할 필요가 있나?
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
        // console.log('카운트 다운 완료');
        setShowCountdown(false);
        toggleRunning(); // 타이머 시작
    };

    useEffect(() => {
        if (data) {
            // 진행중인 운동이 있으면 해당 운동의 id를 저장
            const inProgressExercise = data.exercises.find((exercise) => exercise.state === 'inProgress');

            if (inProgressExercise) {
                setCurrentExercise(inProgressExercise._id);
            } else {
                const cheakAllDone = data.exercises.every((exercise) => exercise.state === 'done');
                setCurrentExercise(undefined);
                if (cheakAllDone && !allDone) {
                    setAllDone(true);
                    toast({
                        title: "모든 운동이 완료되었습니다.",
                        description: "완료하기 버튼을 눌러주세요."
                    });
                }
            }
        }
    }, [data])

    useEffect(() => {
        // 조건 currentExercise 또는 data가 바뀔때마다 실행
        // 결과 restTime을 설정하고, sessionData를 설정
        // 현재 운동이 바뀔때마다 세션 데이터를 설정 + 휴식 시간 설정
        if (data && currentExercise) {
            // restTime을 설정
            if (isResting) {
                // 로컬 스토리지에서 휴식 시간 복원
                const savedTime = localStorage.getItem('rest_time');
                setRestTime(savedTime ? parseInt(savedTime, 10) : 0);
                // 만약 isResting이 true인 상태에서  새로고침을 할 경우 defaultRestTime을 설정 해야함
                if (defaultRestTime === 10000) setDefaultRestTime(data?.exercises.find((Exercise) => Exercise._id === currentExercise)?.rest || 60);
            } else {
                // 초기화 또는 새로운 운동 시작시 기본 휴식 시간 설정
                const defaultRest = data?.exercises.find((Exercise) => Exercise._id === currentExercise)?.rest || 60;
                setRestTime(defaultRest); //카운트 다운을 위한 기본 휴식 시간 설정
                setDefaultRestTime(defaultRest); // progress를 계산하기위한 기본 휴식 시간 설정
            }
            // sessionData를 설정
            // sessionData는 처음 운동을 시작하면 handleExerciseStart에서 설정됨
            // 그럼 서버에 값이 저장되고 그걸 query로 가져와서
            // 여기 useEffect에서 sessionData를 설정함
            // 그럼 다음 세트를 시작할때 handleSessionData에서 sessionData를 업데이트함
            const set = data?.exercises.find((exercise) => exercise._id === currentExercise)?.session.length || 0; //기본적으로 0이 나올 것임 처음 시작하는 운동이기 때문
            const lastSession = data?.exercises.find((exercise) => exercise._id === currentExercise)?.session.slice(-1)[0];
            if (!lastSession) return setSessionData({ set: set, reps: 8, weight: 25 });// 처음 시작하는 운동일 경우
            const newSessionData = { set: lastSession?.set, reps: lastSession?.reps, weight: lastSession?.weight } // 서버에서 가져온 마지막 세션 데이터
            setSessionData(newSessionData);
        }
    }, [currentExercise, data])

    useEffect(() => {
        // 휴식 종료시 새로운 세트 생성을 위한 서버에 데이터 전송
        if (!isResting && restTime === -999) {
            const fetchedData = data?.exercises.find((exercise) => exercise._id === currentExercise);
            if (fetchedData) handleSessionData(fetchedData);
        }
    }, [isResting, restTime])



    if (isLoading || !sessionId) return <div className='w-full h-full flex items-center justify-center '><LoadingSpinner className='w-[5vh] h-[5vh]' /></div>;
    if (error) return <div>에러 발생</div>

    return (
        <div className='mx-auto w-full h-full   flex-1 max-w-3xl rounded-xl p-4'>
            {showCountdown && (
                <CountdownOverlay onComplete={handleCountdownComplete} />
            )}
            {allDone && loading && <LoadingOverlay isLoading={loading} text={'업데이트 중'} />}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mb-4">
                    <TabsTrigger value="list" className="flex-1">
                        목록 ({data?.exercises.length})
                    </TabsTrigger>
                    <TabsTrigger value="inProgress" className="flex-1">
                        진행중 ({currentExercise ? 1 : 0})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list" className='space-y-2'>
                    <div className="space-y-2 max-h-[64vh] overflow-y-scroll">
                        {data?.exercises.map((exercise) => {
                            return (
                                <Card key={exercise._id} className="p-4 flex justify-between items-center">
                                    <div className='flex flex-col'>
                                        <span className={` max-smc:truncate max-smc:w-32`}>{exercise.title}</span>
                                        <CardDescription className={` max-smc:truncate max-smc:w-32`}> {exercise.sets}세트, 휴식시간: {exercise.rest}초</CardDescription>
                                    </div>
                                    <Button
                                        onClick={() => handleExerciseStart(exercise!)}
                                        variant="outline"
                                        disabled={exercise.state !== 'pending'}
                                    >
                                        {loading ? <LoadingSpinner /> : exercise.state === 'pending' ? '시작' : exercise.state === 'inProgress' ? '진행중' : '완료'}
                                    </Button>
                                </Card>
                            )
                        })}
                    </div>
                    <div className='flex-1 flex justify-center py-2   '>
                        <Button variant='default' onClick={handleAllDone} >{allDone ? '운동 완료' : '운동 종료'}</Button>
                    </div>
                </TabsContent>

                <InProgressTap
                    data={data}
                    currentExercise={currentExercise}
                    loading={loading}
                    isRunning={isRunning}
                    isResting={isResting}
                    progress={progress}
                    restTime={restTime}
                    formattedTime={formattedTime}
                    handleStartRest={handleStartRest}
                    handleSkipRest={handleSkipRest}
                    handleDone={handleDone}
                    toggleRunning={toggleRunning}
                />
            </Tabs>
        </div>
    )
}

export default Page
