'use client'
import { getSpecificExercisePlan } from '@/server/queries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExerciseSession } from '@/utils/util';

const Page = () => {
    const { exercisePlanId } = useParams();
    const [activeTab, setActiveTab] = useState("list");
    const [cData, setCData] = useState<ExerciseSession | undefined>(undefined);
    if (typeof exercisePlanId !== 'string') {
        return <div>유효하지 않은 세션 ID</div>;
    }
    const { data, error, isLoading } = getSpecificExercisePlan(exercisePlanId);
    useEffect(() => {
        if (data && !cData) {
            const newData = { userId: data.userId, exercisePlanId: data._id, exercises: data.exercises, state: 'pending' } as ExerciseSession;
            setCData(newData);
        }
    }, [data])
    if (isLoading) return <div>로딩중...</div>
    if (error) return <div>에러 발생</div>

    return (
        <div className='mx-auto w-full max-w-3xl rounded-xl p-4'>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mb-4">
                    <TabsTrigger value="list" className="flex-1">
                        목록 ({ })
                    </TabsTrigger>
                    <TabsTrigger value="inProgress" className="flex-1">
                        진행중 ({ })
                    </TabsTrigger>
                    <TabsTrigger value="done" className="flex-1">
                        완료 ({ })
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="list">
                    <div className="space-y-2">
                        {cData?.exercises.map(item => (
                            <Card key={item._id} className="p-4 flex justify-between items-center">
                                <span className={` max-smc:truncate max-smc:w-32`}>{item.title}</span>
                                <Button
                                    // onClick={() => handleStartItem(item._id)}
                                    variant="outline"
                                >
                                    시작하기
                                </Button>
                            </Card>
                        ))}
                        {cData?.exercises.length === 0 && (
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