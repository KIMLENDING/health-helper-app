import { create } from 'zustand';

interface DialogState {
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;

    // 다이얼로그 열기 (커스텀 설정 가능)
    openDialog: (options: {
        title?: string;
        description?: string;
        onConfirm: () => void;
    }) => void;

    // 다이얼로그 닫기
    closeDialog: () => void;

    // 확인 버튼 액션 실행
    confirmAction: () => void;
}

// 기본 다이얼로그 텍스트
const DEFAULT_TITLE = '운동을 종료 하시겠습니까?';
const DEFAULT_DESCRIPTION = '운동을 종료하면 종료한 운동은 다시 시작할 수 없습니다.';

export const useDialogStore = create<DialogState>((set, get) => ({
    // 초기 상태
    isOpen: false,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    onConfirm: () => { }, // 기본은 빈 함수

    // 다이얼로그 열기
    openDialog: (options) => set({
        isOpen: true,
        title: options.title || DEFAULT_TITLE,
        description: options.description || DEFAULT_DESCRIPTION,
        onConfirm: options.onConfirm,
    }),

    // 다이얼로그 닫기
    closeDialog: () => set({
        isOpen: false,
    }),


    // 확인 액션 실행 및 다이얼로그 닫기
    confirmAction: () => {
        const { onConfirm } = get();
        onConfirm();
        set({ isOpen: false });
    },
}));