import { create } from 'zustand';

interface StopwatchState {
    time: number; // 초 단위 경과 시간
    isRunning: boolean; // 타이머 실행 상태
    startTime: number | null; // 실행 시작 시간
    start: () => void; // 타이머 시작
    stop: () => void; // 타이머 정지
    reset: () => void; // 타이머 리셋
    updateTime: () => void; // 시간 업데이트
}

export const useStopwatchStore = create<StopwatchState>((set, get) => ({
    time: (() => {
        // 초기화 시 로컬 스토리지에서 시간 복원
        const savedTime = localStorage.getItem('stopwatch_time');
        return savedTime ? parseInt(savedTime, 10) : 0;
    })(),
    isRunning: (() => {
        // 초기화 시 실행 상태 복원
        const savedRunningState = localStorage.getItem('stopwatch_running');
        return savedRunningState === 'true';
    })(),
    startTime: null, // 시작 시간은 새로고침 시 복원하지 않음
    start: () => {
        if (get().isRunning) return; // 이미 실행 중이면 무시
        set({ isRunning: true, startTime: Date.now() });
        localStorage.setItem('stopwatch_running', 'true');
    },
    stop: () => {
        if (!get().isRunning) return; // 실행 중이 아니면 무시
        set((state) => {
            const elapsed = Math.floor((Date.now() - (state.startTime ?? Date.now())) / 1000);
            const updatedTime = state.time + elapsed;
            localStorage.setItem('stopwatch_time', updatedTime.toString());
            return { isRunning: false, time: updatedTime, startTime: null };
        });
        localStorage.setItem('stopwatch_running', 'false');
    },
    reset: () => {
        set({ time: 0, isRunning: false, startTime: null });
        localStorage.removeItem('stopwatch_time');
        localStorage.removeItem('stopwatch_running');
    },
    updateTime: () => {
        if (get().isRunning && get().startTime) {
            const startTime = get().startTime ?? Date.now();
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            set({ time: get().time + elapsed, startTime: Date.now() });
        }
    },
}));
