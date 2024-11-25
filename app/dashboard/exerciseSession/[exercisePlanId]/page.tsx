'use client'
import { getSpecificExercisePlan } from '@/server/queries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExerciseSession } from '@/utils/util';
import { toast } from '@/hooks/use-toast';

const Page = () => {
    const { exercisePlanId } = useParams() as { exercisePlanId: string };
    const [activeTab, setActiveTab] = useState("list");
    const [cData, setCData] = useState<ExerciseSession | undefined>(undefined); // 서버에서 받아온 데이터를 가공할 변수
    const [isProgress, setIsProgress] = useState<ExerciseSession['exercises'][number] | undefined>(undefined);

    const [timer, setTimer] = useState<number | null>(null); // 전체 운동 시간 타이머
    const [restTimer, setRestTimer] = useState<number | null>(null); // 휴식 타이머
    const [isPaused, setIsPaused] = useState(false);

    const { data, error, isLoading } = getSpecificExercisePlan(exercisePlanId);
    useEffect(() => {
        if (data && !cData) { // 데이터가 있고 가공된 데이터가 없을 때 -- 초기랜더링 시  한번만 실행
            const newData = {
                userId: data.userId,
                exercisePlanId: data._id,
                state: 'pending',
                exercises: data.exercises.map(({ _id, ...rest }) => rest),
            } as ExerciseSession;
            setCData(newData); // 가공된 데이터를 저장
        }
    }, [data, cData]);
    console.log(isProgress)

    const startTimer = (duration: number) => setTimer(duration); //
    const pauseTimer = () => setIsPaused(true);
    const resumeTimer = () => setIsPaused(false);
    const stopTimer = () => setTimer(null);

    const handleStartItem = (exerciseId: string) => {
        if (isProgress) {
            toast({ variant: "destructive", title: `현재 진행중인 운동 ${isProgress.title}이(가) 있습니다.` });
            return; // 이미 inProgress 상태인 exercise가 있다면 함수 종료
        }
        setCData((prev) => {
            if (!prev) return prev;
            const newExercises = prev.exercises.map((exercise) => {
                if (exercise.exerciseId === exerciseId) {
                    const tmp = { ...exercise, state: 'inProgress' };
                    setIsProgress(tmp);
                    return tmp; // 시작 버튼을 누른 exercise의 state를 inProgress로 변경
                }
                return exercise;
            });
            return { ...prev, exercises: newExercises };
        });
        setActiveTab("inProgress"); // 탭을 진행중으로 변경
    };

    useEffect(() => {
        if (timer === null || isPaused) return;
        const interval = setInterval(() => {
            setTimer(prev => (prev !== null ? prev - 1 : null));
        }, 1000);

        if (timer === 0) clearInterval(interval);

        return () => clearInterval(interval);
    }, [timer, isPaused]);

    if (isLoading) return <div>로딩중...</div>
    if (error) return <div>에러 발생</div>

    return (
        <div className='mx-auto w-full max-w-3xl rounded-xl p-4'>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mb-4">
                    <TabsTrigger value="list" className="flex-1">
                        목록 ({cData?.exercises.length})
                    </TabsTrigger>
                    <TabsTrigger value="inProgress" className="flex-1">
                        진행중 ({isProgress ? 1 : 0})
                    </TabsTrigger>

                </TabsList>
                <TabsContent value="list">
                    <div className="space-y-2">
                        {cData?.exercises?.map(item => (
                            <Card key={item.exerciseId} className="p-4 flex justify-between items-center">
                                <span className={` max-smc:truncate max-smc:w-32`}>{item.title}</span>
                                <Button
                                    onClick={() => handleStartItem(item.exerciseId)}
                                    variant="outline"
                                    disabled={item.state === 'inProgress'}
                                >
                                    {item.state !== 'inProgress' ? '시작하기' : '진행중'}
                                </Button>
                            </Card>
                        ))}
                        {cData?.exercises.length === 0 && (
                            <p className="text-center text-gray-500 py-4">목록이 비어있습니다</p>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="inProgress">
                    <div className="space-y-2">
                        {isProgress && (
                            <Card className="p-4 flex justify-between items-center">
                                <span>{isProgress.title}</span>
                                <div>
                                    <Button onClick={pauseTimer} variant="outline">일시정지</Button>
                                    <Button onClick={stopTimer} variant="outline">종료</Button>
                                </div>
                            </Card>
                        )

                        }
                        {!isProgress && (
                            <p className="text-center text-gray-500 py-4">목록이 비어있습니다</p>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
            시작 버튼을 누르면 3초 후 카운트 다운을 하고 타이머가 시작
            타이머는 일시정지 , 종료 버튼이 있음
            {/* {data?.title}
            <div>
                {data?.exercises.map((exercise) => {
                    return (
                        <div key={exercise._id}>
                            {exercise.title}
                            {Array.from({ length: exercise.sets }).map((_, index) => (
                                <div key={index} className='flex flex-row gap-4'>
                                    <div>
                                        {exercise.reps}회
                                    </div>
                                    <div>
                                        {exercise.rest}초 휴식
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                })}
            </div> */}
        </div>
    )
}

export default Page