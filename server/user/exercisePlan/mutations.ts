import { toast } from "@/hooks/use-toast";
import { fetcher, handleMutationError } from "@/lib/react-query/mutation";
import { ExercisePlan } from "@/utils/util";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * 
타입 | 의미
TVariables | 서버로 보낼 데이터 타입
TData | 서버로부터 받을 응답 데이터 타입
TError | 에러 발생 시 받을 에러 타입
TContext | 낙관적 업데이트 등에 쓰이는 임시 데이터 타입
 */



/**
 * * /api/user/exercisePlan
 *  사용자 전용 운동 계획 생성 Mutation
 * @returns 
 */

export const useCreatePlan = () => {
    const queryClient = useQueryClient();
    return useMutation<{ message: string }, Error, ExercisePlan>({
        mutationFn: async (exercisePlan: ExercisePlan) => {
            return fetcher(`${process.env.NEXTAUTH_URL}/api/user/exercisePlan`, 'POST', exercisePlan)
        },
        onSuccess: async (data) => {
            toast({ variant: 'default2', title: `${data.message}` });
            await queryClient.invalidateQueries({ queryKey: ["exercisePlans"] }) // 데이터 갱신 후 자동으로 UI 업데이트
        },
        onError: handleMutationError,
    })
}

/**
 *  * /api/user/exercisePlan
 *  사용자 전용 운동 플랜에 운동 추가 Mutation
 * @returns 
 */

export const useUpdatePlan = () => {
    const queryClient = useQueryClient();
    return useMutation<{ message: string, exercisePlan: any }, Error, any>({
        mutationFn: async (data: any) => {
            return fetcher(`${process.env.NEXTAUTH_URL}/api/user/exercisePlan`, 'PATCH', data)
        },
        onSuccess: async (data) => {
            toast({ variant: 'default2', title: `${data.message}` });
            await queryClient.invalidateQueries({ queryKey: ["exercisePlans"] })
            await queryClient.invalidateQueries({ queryKey: ["exercisePlan", data.exercisePlan._id] })
            queryClient.removeQueries({ queryKey: ["selectedExercise"] }); // 캐시된 데이터를 초기화합니다.
        },
        onError: handleMutationError,
    })
};

/** 
 * * /api/user/exercisePlan/[planId]
 * 사용자 전용 운동 계획 삭제 Mutation
 * @returns
*/
export const useDeletePlan = () => {
    const queryClient = useQueryClient();
    return useMutation<{ message: string, exercisePlan: any }, Error, string>({
        mutationFn: async (exercisePlanId: string) => {
            return fetcher(`${process.env.NEXTAUTH_URL}/api/user/exercisePlan/${exercisePlanId}`, 'DELETE')
        },
        onSuccess: async (data) => {
            toast({ variant: 'default2', title: `${data.message}` });
            await queryClient.invalidateQueries({ queryKey: ["exercisePlans"] })
            queryClient.removeQueries({ queryKey: ["exercisePlan", data.exercisePlan._id] })
        },
        onError: handleMutationError,
    })
}

/** 
 *  * /api/user/exercisePlan/[planId]
 * 사용자 전용 운동 계획 수정 Mutation
 * @description 운동 계획을 수정하는 Mutation입니다. 운동계획의 제목, 세부 운동 목록의 세트, 반복, 무게를 수정합니다.
 * @param exercisePlanId - 수정할 운동 계획의 ID입니다. 
 * @param title - 수정할 운동 계획의 제목입니다.
 * @param exercises - 수정할 운동 계획의 세부 운동 목록입니다. 각 운동의 ID, 세트, 반복, 무게를 포함합니다.
 * @returns
*/
export const useEditPlan = () => {
    const queryClient = useQueryClient();
    return useMutation<{ message: string, exercisePlan: any }, Error, any>({
        mutationFn: async (data: any) => {
            return fetcher(`${process.env.NEXTAUTH_URL}/api/user/exercisePlan/${data.exercisePlanId}`, 'PATCH', data)
        },
        onSuccess: async (data) => {
            toast({ variant: 'default2', title: `${data.message}${data.exercisePlan._id}` });
            await queryClient.invalidateQueries({ queryKey: ["exercisePlan", data.exercisePlan._id] })
            await queryClient.invalidateQueries({ queryKey: ["exercisePlans"] })
        },
        onError: handleMutationError,
    })
}
