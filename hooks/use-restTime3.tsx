'use client';
import { useState, useEffect, useRef } from 'react';
import { toast } from './use-toast';

interface RestTimeHook {
    isRunning: boolean;
    defaultRestTime: number;
}

export const useRestTime = ({
    isRunning,
    defaultRestTime,
}: RestTimeHook) => {
    const [progress, setProgress] = useState<number>(0); // 진행률
    const [restTime, setRestTime] = useState<number>(defaultRestTime); // 남은 휴식 시간
    const [isResting, setIsResting] = useState(false); // 휴식 상태 관리
    const startTimeRef = useRef<number | null>(null); // 타이머 시작 시간 기록
    const animationFrameRef = useRef<number | null>(null); // 애니메이션 프레임 ID

    useEffect(() => {
        // 초기 값 복원
        const savedTime = localStorage.getItem('rest_time');
        const savedStartTime = localStorage.getItem('rest_startTime');
        const savedIsResting = localStorage.getItem('isResting');

        if (savedTime) setRestTime(parseInt(savedTime, 10));
        if (savedStartTime) startTimeRef.current = parseInt(savedStartTime, 10);
        if (savedIsResting) setIsResting(savedIsResting === 'true');
    }, []);

    useEffect(() => {
        if (isRunning && isResting && startTimeRef.current) {
            const updateRestTime = () => {
                const now = Date.now();
                const elapsed = Math.floor((now - startTimeRef.current!) / 1000);
                const remainingTime = Math.max(defaultRestTime - elapsed, 0);

                setRestTime(remainingTime);
                setProgress((remainingTime / defaultRestTime) * 100);

                // 휴식 종료 처리
                if (remainingTime === 0) {
                    handleEndRest();
                } else {
                    // 다음 프레임 예약
                    animationFrameRef.current = requestAnimationFrame(updateRestTime);
                }
            };

            // 첫 번째 프레임 업데이트
            animationFrameRef.current = requestAnimationFrame(updateRestTime);
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [isRunning, isResting]);

    const handleStartRest = () => {
        if (!isRunning) return;

        setIsResting(true);
        startTimeRef.current = Date.now(); // 시작 시간 기록
        localStorage.setItem('rest_startTime', startTimeRef.current.toString());
        localStorage.setItem('isResting', 'true');

        toast({ title: '휴식시간!!' });
    };

    const handleSkipRest = () => {
        if (!isRunning) return;

        handleEndRest();
        setRestTime(0); // 즉시 종료
        localStorage.removeItem('rest_time');
        localStorage.removeItem('rest_startTime');
        localStorage.removeItem('isResting');
    };

    const handleEndRest = () => {
        setIsResting(false);
        setRestTime(defaultRestTime);
        setProgress(0);
        startTimeRef.current = null;

        localStorage.removeItem('rest_time');
        localStorage.removeItem('rest_startTime');
        localStorage.removeItem('isResting');
    };

    useEffect(() => {
        // 휴식 중일 때 남은 시간 저장
        if (isResting) {
            localStorage.setItem('rest_time', restTime.toString());
        }
    }, [restTime]);

    return {
        progress,
        restTime,
        isResting,
        handleSkipRest,
        handleStartRest,
    };
};
