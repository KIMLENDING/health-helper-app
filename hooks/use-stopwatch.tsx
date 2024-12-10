'use client'
import { useState, useEffect } from 'react';

// 2와 다른게 stopwatch_running이 true일 때 페이지가 로드되면 즉시 반영되는데 
// 2는 페이지가 로드되면 true에서 false로 바뀜
export const useStopwatch = () => {
    const [time, setTime] = useState(() => {
        // 초기 값으로 로컬 스토리지에서 시간 복원
        const savedTime = localStorage.getItem('stopwatch_time');
        return savedTime ? parseInt(savedTime, 10) : 0;
    });
    const [isRunning, setIsRunning] = useState(() => {
        // 초기 값으로 로컬 스토리지에서 실행 상태 복원
        const savedRunningState = localStorage.getItem('stopwatch_running');
        return savedRunningState === 'true';
    });

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

        return () => { // 컴포넌트 언마운트 시 clearInterval
            if (interval) clearInterval(interval);
        };
    }, [isRunning]);


    useEffect(() => {
        // 실행 상태 변경 시 로컬 스토리지에 저장
        localStorage.setItem('stopwatch_running', isRunning.toString());
    }, [isRunning]);


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
