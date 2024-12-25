'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@radix-ui/react-progress';
import { Play, SkipForward, Timer } from 'lucide-react';
import React from 'react'
import { useRestTime } from '@/hooks/use-restTime3';
const Page = () => {
    const {
        progress,
        restTime,
        isResting,
        handleSkipRest,
        handleStartRest,
    } = useRestTime({
        isRunning: true,
        defaultRestTime: 300, // 5분 = 300초
    });

    // 남은 시간을 분:초 형식으로 변환
    const formatTime = (seconds: any) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Timer className="w-5 h-5" />
                    휴식 타이머
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* 타이머 디스플레이 */}
                <div className="text-center">
                    <span className="text-4xl font-bold">
                        {formatTime(restTime)}
                    </span>
                </div>

                {/* 진행 바 */}
                <Progress value={progress} className="h-2 transition-all" />

                {/* 컨트롤 버튼 */}
                <div className="flex justify-center gap-4 mt-4">
                    {!isResting ? (
                        <Button
                            onClick={handleStartRest}
                            className="flex items-center gap-2"
                            variant="default"
                        >
                            <Play className="w-4 h-4" />
                            휴식 시작
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSkipRest}
                            className="flex items-center gap-2"
                            variant="secondary"
                        >
                            <SkipForward className="w-4 h-4" />
                            건너뛰기
                        </Button>
                    )}
                </div>

                {/* 상태 표시 */}
                <div className="text-center text-sm text-muted-foreground">
                    {isResting ? "휴식 중..." : "휴식 시간을 시작하세요"}
                </div>
            </CardContent>
        </Card>
    );
};

export default Page