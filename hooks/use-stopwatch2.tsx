'use client';
import { useState, useEffect, useRef } from 'react';

export const useStopwatch = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false); // 초기 상태 확인
    const lastTimeRef = useRef<number | null>(null); // 마지막 실행 시간을 저장

    // 초기화 상태 복원
    useEffect(() => {
        const savedTime = localStorage.getItem('stopwatch_time');
        if (savedTime) {
            setTime(parseInt(savedTime, 10));
        }

        const savedRunningState = localStorage.getItem('stopwatch_running');
        if (savedRunningState) {
            setIsRunning(savedRunningState === 'true');
        }

        setIsInitialized(true);
    }, []);

    // 타이머 실행
    useEffect(() => {
        if (isRunning) {
            lastTimeRef.current = Date.now(); // 시작 시 현재 시간을 기록
        }

        const updateTimer = () => {
            if (isRunning && lastTimeRef.current !== null) {
                const now = Date.now();
                const elapsedSeconds = Math.floor((now - lastTimeRef.current) / 1000); // 경과 시간 계산
                if (elapsedSeconds > 0) {
                    setTime((prevTime) => {
                        const updatedTime = prevTime + elapsedSeconds;
                        localStorage.setItem('stopwatch_time', updatedTime.toString()); // 시간 저장
                        return updatedTime;
                    });
                    lastTimeRef.current = now; // 마지막 실행 시간 업데이트
                }
            }
        };

        const interval = setInterval(updateTimer, 100); // 100ms 간격으로 경과 시간 확인

        return () => clearInterval(interval); // 클린업
    }, [isRunning]);

    // 실행 상태 저장
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('stopwatch_running', isRunning.toString());
        }
    }, [isRunning, isInitialized]);

    // 시간 포맷팅
    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}분:${seconds.toString().padStart(2, '0')}초`;
    };

    // 실행 상태 토글
    const toggleRunning = () => {
        setIsRunning((prev) => !prev);
    };

    // 초기화
    const reset = () => {
        setTime(0);
        setIsRunning(false);
        localStorage.removeItem('stopwatch_time');
        localStorage.removeItem('stopwatch_running');
        lastTimeRef.current = null;
    };

    return {
        time,
        isRunning,
        formattedTime: formatTime(time),
        toggleRunning,
        reset,
    };
};
