import { create } from 'zustand';
import { Exercise } from '@/utils/util';

interface SelectedExercisesState {
    exercises: Exercise[];
    setExercises: (exercises: Exercise[]) => void;
    clearExercises: () => void;
}

/**
 * 선택된 운동 목록을 관리하는 Zustand 스토어
 * 컴포넌트 간 데이터 공유를 위해 사용
 */
export const useSelectedExercisesStore = create<SelectedExercisesState>((set) => ({
    exercises: [],

    // 운동 목록 설정
    setExercises: (exercises) => set({ exercises }),

    // 운동 목록 초기화
    clearExercises: () => set({ exercises: [] }),
}));
