
import { toast } from "@/hooks/use-toast";
import { Exercise } from "@/utils/util";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * * /api/admin/exercise
 *  관리자 전용 운동 추가 Mutation
 * @returns 
 */
export const addExercise = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (postData: Partial<Exercise>) => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/exercise`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(postData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return response.json();
        },
        onSuccess: async (data) => {
            toast({ variant: 'default2', title: `${data.message}` });
            await queryClient.invalidateQueries({ queryKey: ["exercises"] }) // 데이터 갱신 후 자동으로 UI 업데이트
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : String(error);
            console.error("onError", error);
            toast({ variant: "destructive", title: `${message} 동일한 이름의 운동이 있습니다. ` });
        },
    })
}


/**
 * * /api/admin/exercise/[exerciseId]
 * 관리자 전용 운동 삭제 Mutation
 * @returns 
 */
export const useDeleteExercise = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (exerciseId: string) => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/exercise/${exerciseId}`, {
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
            toast({ variant: 'default2', title: `${data.message}` });
            await queryClient.invalidateQueries({ queryKey: ["exercises"] })
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : String(error);
            console.error("onError", error);
            toast({ variant: "destructive", title: message });
        },
    })
}

/**
 * * /api/admin/exercise/[exerciseId]
 * @returns * 관리자 전용 운동 수정 Mutation
 */
export const useUpdateExercise = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedData: Partial<Exercise>) => {
            console.log("updatedData", updatedData)
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/exercise/${updatedData._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            })
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return response.json()
        },
        onSuccess: (data) => {
            toast({ variant: "default2", title: `${data.message}` })
            queryClient.invalidateQueries({ queryKey: ["exercises"] }) // 데이터 갱신 후 자동으로 UI 업데이트
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : String(error);
            console.error("onError", error);
            toast({ variant: "destructive", title: message });
        },
    },
    )
}