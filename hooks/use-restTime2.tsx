'use client'
import { useState, useEffect, useRef } from 'react';
import { toast } from './use-toast';

interface RestTimeHook {
    isRunning: boolean;
    currentExercise: string | undefined;
    defaultRestTime: number;
}

export const useRestTime = ({
    isRunning,
    defaultRestTime,
}: RestTimeHook) => {
    const [progress, setProgress] = useState<number>(0); // 진행률
    const [restTime, setRestTime] = useState<number>(60); // 기본 휴식 시간
    const [isResting, setIsResting] = useState(false); // 휴식 상태 관리
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // 초기 값으로 로컬 스토리지에서 시간 복원
        const savedTime = localStorage.getItem('rest_time');
        if (savedTime) {
            setRestTime(parseInt(savedTime, 10));
        }

        // 초기 값으로 로컬 스토리지에서 실행 상태 복원
        const savedRunningState = localStorage.getItem('isResting');
        if (savedRunningState) {
            setIsResting(savedRunningState === 'true');
        }
    }, []);

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
        setProgress(Math.min((restTime / defaultRestTime) * 100, 100));
        // 타이머 종료 시 정리
        if (restTime === 0) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            setRestTime(-999);  // restTime이 -1이고 isResting이 false이면 휴식 종료가 되고 서버에 데이터 전송 하기위한 조건을 만드는 것
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
        // 실행 상태 변경 시 로컬 스토리지에 저장
        if (isResting) { // 휴식 중일때만 저장
            localStorage.setItem('isResting', isResting.toString());
        }
    }, [isResting]);


    useEffect(() => {
        // 휴식 중일 때만 진행률 계산
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
    }, [progress]);


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

    return {
        progress,
        restTime,
        isResting,
        setRestTime,
        setIsResting,
        handleSkipRest,
        handleStartRest
    };
};