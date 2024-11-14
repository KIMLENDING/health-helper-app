import { Exercise } from "@/app/dashboard/admin/addExercise/columns";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 *  관리자 전용 운동 추가 Mutation
 * @returns 
 */
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

/**
 * 관리자 전용 운동 삭제 Mutation
 * @returns 
 */
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

export const useCreatePlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (postData: any) => {
            const response = await fetch('/api/admin/exercisePlan', {
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
                await queryClient.invalidateQueries({ queryKey: ["exercisePlans"] }) // 데이터 갱신 후 자동으로 UI 업데이트
            }
        }
    })
}

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
        onSuccess: (data) => {
            console.log('onSuccess');
            queryClient.setQueryData(["selectedExercise"], data);
        },
        onError: (error) => {
            console.log('onError', error);
        },
        onSettled: async (data, error) => { // 성공, 실패 상관없이 마지막에 호출
            console.log('onSettled');
            if (error) {
                console.log('error', error);
            } else {
                console.log('data', data);
                await queryClient.invalidateQueries({ queryKey: ["selectExercise"] }) // 데이터 갱신 후 자동으로 UI 업데이트
            }
        }
    })
}
