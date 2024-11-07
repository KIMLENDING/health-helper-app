import { create } from 'zustand';

interface SessionState {
    user: {
        email: string;
        name: string;
        role: string;
        image?: string;
    }
    setUserData: (data: any) => void;
}

const useSessionStore = create<SessionState>((set) => ({
    user: {
        email: '',
        name: '',
        role: '',
        image: ''
    },
    setUserData: (data: any) => set((state) => ({ user: { ...state.user, ...data } }))
}));

export default useSessionStore;