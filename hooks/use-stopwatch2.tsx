'use client'
import { useState, useEffect } from 'react';

export const useStopwatch = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false); // 초기화 상태
    // 초기화 상태가 true가 되면 로컬 스토리지에 저장 이걸 안하면 초기화가 끝나기 전에 저장이 되어버림
    // 예를 들면 다른페이지에서 돌아올 때 localStorage에 true로 되어 있지만 useEffect가 false가로 localStorage에 저장해버림
    // useEffect가 

    useEffect(() => {
        // 초기 값으로 로컬 스토리지에서 시간 복원
        const savedTime = localStorage.getItem('stopwatch_time');
        if (savedTime) {
            setTime(parseInt(savedTime, 10));
        }

        // 초기 값으로 로컬 스토리지에서 실행 상태 복원
        const savedRunningState = localStorage.getItem('stopwatch_running');
        if (savedRunningState) {

            setIsRunning(savedRunningState === 'true');
        }

        // 초기화 완료
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isRunning) {
            interval = setInterval(() => {
                setTime(prevTime => {
                    const updatedTime = prevTime + 1;
                    localStorage.setItem('stopwatch_time', updatedTime.toString()); // 시간 저장
                    return updatedTime;
                });
            }, 1000);
        }

        return () => {// 클린업 함수: isRunning 값이 변경되거나 컴포넌트가 언마운트될 때 clearInterval 호출
            if (interval) clearInterval(interval);
        };
    }, [isRunning]);

    useEffect(() => {
        // 초기화 완료 후에만 실행 상태 저장
        if (isInitialized) {
            localStorage.setItem('stopwatch_running', isRunning.toString());
        }
    }, [isRunning, isInitialized]);

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}분:${seconds.toString().padStart(2, '0')}초`;
    };

    const toggleRunning = () => {
        setIsRunning(prev => !prev);
    };

    const reset = () => {
        setTime(0);
        setIsRunning(false);
        localStorage.removeItem('stopwatch_time'); // 로컬 스토리지 초기화
        localStorage.removeItem('stopwatch_running');
    };

    return {
        time,
        isRunning,
        formattedTime: formatTime(time),
        toggleRunning,
        reset,
    };
};
