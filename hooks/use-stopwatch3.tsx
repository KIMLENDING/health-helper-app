'use client';
import { useState, useRef, useEffect } from "react";

export const useStopwatch = () => {
    const [time, setTime] = useState(0); // 현재까지 측정된 시간
    const [isRunning, setIsRunning] = useState(false);
    const requestRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const [isInitialized, setIsInitialized] = useState(false); // 초기 상태 확인
    const elapsedBeforePause = useRef(0); // 일시 정지 시점까지의 경과 시간 저장


    // 초기화 상태 복원
    useEffect(() => {
        const savedRunningState = localStorage.getItem('stopwatch_running');
        if (savedRunningState) { // 저장된 실행 상태가 있으면 복원
            setIsRunning(savedRunningState === 'true');
        }
        const savedTime = localStorage.getItem('start_time'); // 시작 시간 복원
        if (savedTime) {
            startTimeRef.current = parseInt(savedTime, 10);
        }
        const savedElapsedTime = localStorage.getItem('elapsed_time'); // 경과 시간 복원
        if (savedElapsedTime) {
            elapsedBeforePause.current = parseInt(savedElapsedTime, 10);
            if (savedRunningState === 'false') {
                setTime(elapsedBeforePause.current);
            }
        }

        setIsInitialized(true);
    }, []);

    // 타이머 업데이트
    useEffect(() => {
        if (isRunning) {
            requestRef.current = requestAnimationFrame(updateTimer);
        } else if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
        }
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [isRunning]);

    // useEffect(() => {
    //     return () => {
    //         if (time) {
    //             localStorage.setItem('stopwatch_time', time.toString());
    //         }
    //     }
    // }, [time]);



    // 실행 상태 저장
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('stopwatch_running', isRunning.toString());
        }
    }, [isRunning, isInitialized]);

    const updateTimer = () => {
        if (!isRunning) return;
        if (!startTimeRef.current) return;
        // 현재 시간에서 시작 시간 빼기 + 이전 경과 시간 더하기
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTimeRef.current) / 1000 + elapsedBeforePause.current;
        setTime(elapsedTime);
        requestRef.current = requestAnimationFrame(updateTimer);
    };

    const startTimer = () => {
        if (!isRunning) {
            setIsRunning(true);
            startTimeRef.current = Date.now(); // 타이머 시작 시간 기록
            localStorage.setItem('start_time', startTimeRef.current.toString()); // 언마운트 시간 저장
            requestRef.current = requestAnimationFrame(updateTimer);
        }
    };

    const pauseTimer = () => {
        if (isRunning && requestRef.current) {
            setIsRunning(false);
            cancelAnimationFrame(requestRef.current);
            elapsedBeforePause.current = time; // 현재 시간 저장
            localStorage.setItem('elapsed_time', elapsedBeforePause.current.toString()); // 경과 시간 저장
        }
    };
    const toggleRunning = () => {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    };

    const resetTimer = () => {
        if (requestRef.current) {
            setIsRunning(false);
            setTime(0);
            cancelAnimationFrame(requestRef.current);
            elapsedBeforePause.current = 0; // 저장된 시간 초기화
        }
    };
    // 시간 포맷팅
    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${minutes}분:${seconds.toString().padStart(2, '0')}초`;
    };

    return {
        time,
        isRunning,
        formattedTime: formatTime(time),
        toggleRunning,
        reset: resetTimer
    }
};


