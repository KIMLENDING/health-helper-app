'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetExerciseSession } from '@/server/queries';
import { Card, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useActionExerciseSession, useDoneExerciseSession } from '@/server/mutations';
import LoadingSpinner from '@/components/LayoutCompents/LoadingSpinner';
import InProgressTap from './inProgressTap';
import { useRouter } from 'next/navigation';
import LoadingOverlay from '@/components/LayoutCompents/LoadingOverlay';

const TapsComponent = ({ sessionId }: { sessionId: string }) => {
    const [activeTab, setActiveTab] = useState('list');
    const { data, error, isLoading } = useGetExerciseSession(sessionId);
    const { mutateAsync, isPending: isPandingAction } = useActionExerciseSession();
    const { mutateAsync: doneExercise, isPending: isPendingDone } = useDoneExerciseSession();
    const [loadingIndex, setLoadingIndex] = useState<string | null>(null);
    const router = useRouter();

    /**운동 플랜 종료 */
    const updateSessionStatus = async () => {
        if (!data) return;
        localStorage.clear();
        const res = await doneExercise({ sessionId });
        if (res.delete) { // 완료한 운동이 하나도 없을 땐 세션이 삭제됨 
            router.push('/dashboard');
            return;
        }
        router.push(`/dashboard/detail/${data._id}`);
    };

    /** 서버에 운동시작과 종료를 업데이트 하는 함수 */
    const runWithLoading = async (exerciseId: string, action: 'start' | 'done') => {
        try {
            setLoadingIndex(exerciseId);
            const res = await mutateAsync({ sessionId, exerciseId, action });
            if (res.message === 'done' || res.message === 'first') {
                localStorage.clear();
                setActiveTab(res.message === 'done' ? 'list' : 'inProgress');
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
                                {exercise.sets}세트
                            </CardDescription>
                        </div>
                        <Button
                            onClick={() => handleExerciseStart(exercise._id!)}
                            variant="outline"
                            disabled={
                                exercise.state === 'done' || isPandingAction || loadingIndex === exercise._id ||
                                (exercise.state === 'pending' && data.exercises.some(e => e.state === 'inProgress'))
                            }
                        >
                            {{
                                pending: '시작',
                                inProgress: '진행중',
                                done: '완료',
                            }[exercise.state]}
                            {loadingIndex === exercise._id && <LoadingSpinner className="w-5 h-5" />}
                        </Button>
                    </Card>
                ))}
                <Button className='w-full' variant='default' onClick={updateSessionStatus} disabled={isPandingAction || isPendingDone}>운동 완료하기</Button>
                {isPandingAction && <LoadingOverlay isLoading={isPandingAction} text={'서버에 저장 중...'} />} {/* ✅ 로딩 오버레이 */}
            </TabsContent>

            <InProgressTap data={data} sessionId={sessionId} isPending={isPandingAction} handleDone={handleDone} />
        </Tabs>
    );
};

export default TapsComponent;
