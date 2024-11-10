import { Exercise } from "@/app/dashboard/admin/addExercise/columns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import exp from "constants";

export const addExercise = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (postData: Partial<Exercise>) => {
            const response = await fetch('/api/admin/exercise', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(postData)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        },
        onSuccess: () => {
            console.log('onSuccess');
        },
        onError: (error) => {
            console.log('onError', error);
        },
        onSettled: async (data, error) => { // 성공, 실패 상관없이 마지막에 호출 variables
            console.log('onSettled');
            if (error) {
                console.log('error', error);
            } else {
                console.log('data', data);
                await queryClient.invalidateQueries({ queryKey: ["exercises"] }) // 데이터 갱신 후 자동으로 UI 업데이트
            }
        }
    })
}


export const useDeleteExercise = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (exerciseId: string) => {
            const response = await fetch(`/api/admin/exercise/${exerciseId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        },
        onSuccess: () => {
            console.log('onSuccess');
        },
        onError: (error) => {
            console.log('onError', error);
        },
        onSettled: async (data, error) => { // 성공, 실패 상관없이 마지막에 호출 variables
            console.log('onSettled');
            if (error) {
                console.log('error', error);
            } else {
                console.log('data', data);
                await queryClient.invalidateQueries({ queryKey: ["exercises"] }) // 데이터 갱신 후 자동으로 UI 업데이트
            }
        }
    })
}