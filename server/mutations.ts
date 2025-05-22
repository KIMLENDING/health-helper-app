
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * 컴포넌트간 데이터 전달을 위한 Mutation
 * @returns 
 */
export const useSelectedExercise = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (selectedExercises: any[]) => {
            // 클라이언트 측에서만 데이터를 저장
            return selectedExercises;
        },
        onSuccess: async (data) => {
            queryClient.setQueryData(["selectedExercises"], data); // 데이터 저장

        },
        onError: (error) => {
            console.log('onError', error);
        },

    })
}

/**
 * 탈퇴하기
 * @description 유저의 모든 운동 계획과 세션을 삭제하고, 유저를 삭제합니다.
 */
export const useDeleteAccount = () => {
    return useMutation({
        mutationFn: async () => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/delete-account`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return response.json();
        },
        onSuccess: async (data) => {
            toast({ variant: 'default2', title: data.message });

        },
        onError: (error: any) => {
            const message = error instanceof Error ? error.message : String(error);
            console.error("onError", error);
            toast({ variant: "destructive", title: message });
        },
    })
}
