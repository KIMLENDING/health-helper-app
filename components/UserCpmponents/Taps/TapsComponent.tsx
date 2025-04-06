'use client'

import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetExerciseSession } from '@/server/queries';
import { Card, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useActionExerciseSession } from '@/server/mutations';
import LoadingSpinner from '@/components/LayoutCompents/LoadingSpinner';
import { DrawerDialogDone } from '@/components/LayoutCompents/ResponsiceDialog2';

const TapsComponent = ({ sessionId }: { sessionId: string }) => {
    const [activeTab, setActiveTab] = useState('list');
    const { data, error, isLoading } = useGetExerciseSession(sessionId);
    const { mutate, mutateAsync } = useActionExerciseSession();
    const [loadingIndex, setLoadingIndex] = useState<string | null>(null);

    /** 서버에 운동시작과 종료를 업데이트 하는 함수 */
    const runWithLoading = async (exerciseId: string, action: 'start' | 'done') => {
        try {
            setLoadingIndex(exerciseId);
            const res = await mutateAsync({ sessionId, exerciseId, action });
            if (res.message === 'done') {
                localStorage.clear();
                setActiveTab('list');
            } else if (res.message === 'first') {
                localStorage.clear();
                setActiveTab('inProgress');
            }
        } catch (error) {
            console.error(error);
            toast({ title: '오류 발생', description: '운동 상태를 업데이트하는 중 문제가 발생했습니다.' });
        } finally {
            setLoadingIndex(null);
        }
    };

    /** 진행중 탭에서 운동 종료 버튼 클릭 시 호출되는 함수 */
    const handleDone = () => {
        if (!data) return;
        // 진행 중인 운동이 있을 경우 해당 운동의 모든 세트를 완료하지 않고 종료 하고 싶을 때 호출
        const exerciseId = data.exercises.find(ex => ex.state === 'inProgress')?._id;
        if (!exerciseId) return;
        runWithLoading(exerciseId, 'done');
    };
    /** 목록 탭에서 운동 시작 버튼 클릭 시 호출되는 함수 */
    const handleExerciseStart = (exerciseId: string) => {
        if (!data) return;
        if (data.exercises.some(ex => ex.state === 'inProgress')) {
            toast({
                variant: 'destructive',
                title: '이미 진행중인 운동이 있습니다.',
                description: '다른 운동을 진행하기 전에 현재 운동을 완료해주세요.',
            });
            return;
        }
        runWithLoading(exerciseId, 'start');
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

    if (isLoading || !data) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center">Error: {error.message}</div>;

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
                <TabsTrigger value="list" className="flex-1">목록 ({data.exercises.length})</TabsTrigger>
                <TabsTrigger value="inProgress" className="flex-1">
                    진행중 ({data.exercises.filter(ex => ex.state === 'inProgress').length})
                </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-2 max-h-[64vh] overflow-y-scroll">
                {data.exercises.map(exercise => (
                    <Card key={exercise._id} className="p-4 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="max-smc:truncate">{exercise.title}</span>
                            <CardDescription className="max-smc:truncate">
                                {exercise.sets}세트, 휴식시간: {exercise.rest}초
                            </CardDescription>
                        </div>
                        <Button
                            onClick={() => handleExerciseStart(exercise._id!)}
                            variant="outline"
                            disabled={
                                exercise.state === 'done' ||
                                (exercise.state === 'pending' && data.exercises.some(e => e.state === 'inProgress'))
                            }
                        >
                            {exercise.state === 'pending' && '시작'}
                            {exercise.state === 'inProgress' && '진행중'}
                            {exercise.state === 'done' && '완료'}
                            {loadingIndex === exercise._id && <LoadingSpinner className="w-5 h-5" />}
                        </Button>
                    </Card>
                ))}
            </TabsContent>

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
                                {exercise.session.map(set => (
                                    <Card key={set._id} className="flex justify-between items-center p-2 text-nowrap">
                                        <span>{set.set}세트</span>
                                        <Button variant="outline">{set.reps}회</Button>
                                        <Button variant="outline">{set.weight}kg</Button>
                                        <Button variant="outline" onClick={() => handleNewSet(exercise._id!)}>완료</Button>
                                    </Card>
                                ))}
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
            </TabsContent>
        </Tabs>
    );
};

export default TapsComponent;
