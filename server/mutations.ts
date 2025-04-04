
import { toast } from "@/hooks/use-toast";
import { Exercise, ExercisePlan, ExerciseSession, ExercisesessionData, PostExerciseSession } from "@/utils/util";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
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
        onSuccess: () => {
            console.log('onSuccess');
        },
        onError: (error) => {
            console.log('onError', error);
        },
        onSettled: async (data, error) => { // 성공, 실패 상관없이 마지막에 호출 variables
            console.log('onSettled');
            if (error) {
                toast({ variant: 'destructive', title: `${error}` });
                console.log('error', error);
            } else {
                // console.log('data', data);
                toast({ variant: 'default2', title: `${data.message}` });
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
        onSuccess: () => {
            console.log('onSuccess');
        },
        onError: (error) => {
            console.log('onError', error);
        },
        onSettled: async (data, error) => { // 성공, 실패 상관없이 마지막에 호출 variables
            console.log('onSettled');
            if (error) {
                toast({ variant: 'destructive', title: `${error}` });
                console.log('error', error);
            } else {
                // console.log('data', data);
                toast({ variant: 'destructive', title: `${data.message}` });
                await queryClient.invalidateQueries({ queryKey: ["exercises"] }) // 데이터 갱신 후 자동으로 UI 업데이트
            }
        }
    })
}

/**
 *  사용자 전용 운동 계획 생성 Mutation
 * @returns 
 */
export const useCreatePlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (exercisePlan: ExercisePlan) => {

            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exercisePlan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(exercisePlan)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
                toast({ variant: 'destructive', title: `${error}` });
                console.log('error', error);
            } else {
                // console.log('data', data);
                toast({ variant: 'default2', title: `${data.message}` });
                await queryClient.invalidateQueries({ queryKey: ["exercisePlans"] }) // 데이터 갱신 후 자동으로 UI 업데이트
            }
        }
    })
}

/** 
 * 사용자 전용 운동 계획 삭제 Mutation
 * @returns
*/
export const useDeletePlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (exercisePlanId: string) => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exercisePlan/${exercisePlanId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
                toast({ variant: 'destructive', title: `${error}` });
                console.log('error', error);
            } else {
                // console.log('data', data);
                toast({ variant: 'destructive', title: `${data.message}` });
                await queryClient.invalidateQueries({ queryKey: ["exercisePlans"] }) // 데이터 갱신 후 자동으로 UI 업데이트
            }
        }
    })
}
/** 
 * 사용자 전용 운동 계획 제목 수정 Mutation
 * @returns
*/
export const useEditPlanTitle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ title, exercisePlanId }: { title: string, exercisePlanId: string }) => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exercisePlan/${exercisePlanId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(title)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
                toast({ variant: 'destructive', title: `${error}` });
                console.log('error', error);
            } else {
                // console.log('data', data);
                toast({ variant: 'default2', title: `${data.message}` });
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
            queryClient.setQueryData(["selectedExercise"], data); // 데이터 저장
        },
        onError: (error) => {
            console.log('onError', error);
        },
        onSettled: async (data, error) => { // 성공, 실패 상관없이 마지막에 호출
            console.log('onSettled');
            if (error) {
                console.log('error', error);
            } else {
                // console.log('data', data);
                toast({ variant: "default2", title: "운동이 임시 테이블에 추가 되었습니다." })
                await queryClient.invalidateQueries({ queryKey: ["selectedExercise"] }) // 데이터 갱신 후 자동으로 UI 업데이트
            }
        }
    })
}


/**
 *  사용자 전용 운동 계획 수정 Mutation
 * @returns 
 */
export const useUpdatePlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (exercisePlan: ExercisePlan) => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exercisePlan`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(exercisePlan)
            });
            if (!response.ok) {
                const errorData = await response.json(); // 서버의 메시지 파싱
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
                toast({ variant: 'destructive', title: `${error}` });
                console.log('error', error);
            } else {
                // console.log('data', data);
                toast({ variant: 'destructive', title: `${data.message}` });
                await queryClient.invalidateQueries({ queryKey: ["exercisePlans"] }) // 데이터 갱신 후 자동으로 UI 업데이트
            }
        }
    })
};


/**
 *  사용자 전용 운동 계획 삭제 Mutation
 * @returns 
 */
interface DeletePlanProps {
    exercisePlanId: string;
    exerciseId: string;
}
export const useDetailDeletePlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (deleteExercise: DeletePlanProps) => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exercisePlan/${deleteExercise.exercisePlanId}/${deleteExercise.exerciseId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
                toast({ variant: 'destructive', title: `${error}` });
                console.log('error', error);
            } else {
                toast({ variant: 'default2', title: `${data.message}` });
                await queryClient.invalidateQueries({ queryKey: ["exercisePlans"] }) // 데이터 갱신 후 자동으로 UI 업데이트
            }
        }
    })
};

/** 
 * 운동 세션 생성 Mutation
*/

export const useCreateExerciseSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (exerciseSession: ExerciseSession) => {

            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exerciseSession`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(exerciseSession)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
                toast({ variant: 'destructive', title: `${error}` });
                console.log('error', error);
            } else {
                await queryClient.invalidateQueries({ queryKey: ["exerciseSession", data.newExerciseSession._id] }) // 데이터 갱신 후 자동으로 UI 업데이트
                await queryClient.invalidateQueries({ queryKey: ["inProgress"] }) // 데이터 갱신 후 자동으로 UI 업데이트
            }
        }
    })
};


/**
 * 운동 세션 상태 변경 Mutation
 * @returns 
 */

export const useStateChangeExerciseSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exerciseSession/${data.sessionId}/${data.exerciseId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
                toast({ variant: 'destructive', title: `${error}` });
                console.log('error', error);
            } else {
                await queryClient.invalidateQueries({ queryKey: ["exerciseSession", data.updatedSession._id] }) // 데이터 갱신 후 자동으로 UI 업데이트
                await queryClient.invalidateQueries({ queryKey: ["inProgress"] }) // 데이터 갱신 후 자동으로 UI 업데이트
            }
        }
    })
};

/**
 * 운동 세션 모두 완료 Mutation
 * @returns 
 */

export const useAllDoneExerciseSession = () => {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exerciseSession/${data.sessionId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
                toast({ variant: 'destructive', title: `${error}` });
                console.log('error', error);
            } else {

                toast({ variant: 'default2', title: `${data.message}` });
                queryClient.invalidateQueries({ queryKey: ["inProgress"] })
                if (data.updatedSession) { // 데이터가 있을 경우에만 invalidateQueries 호출


                    await queryClient.invalidateQueries({ queryKey: ["exerciseSession", data.updatedSession._id] }) // 데이터 갱신 후 자동으로 UI 업데이트
                }
            }
        }
    })
};

/**
 * 무게나 횟수 변경 Mutation
 * @returns 
 */
export const useEditExerciseSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exerciseSession/${data.sessionId}/${data.exerciseId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return response.json();
        },
        onSettled: async (data, error) => { // 성공, 실패 상관없이 마지막에 호출 variables
            console.log('onSettled');
            if (error) {
                toast({ variant: 'destructive', title: `${error}` });
                console.log('error', error);
            } else {
                console.log('data', data);
                toast({ variant: 'default2', title: `${data.message}` });
                await queryClient.invalidateQueries({ queryKey: ["exerciseSession", data.updatedSession._id] }) // 데이터 갱신 후 자동으로 UI 업데이트
                await queryClient.invalidateQueries({ queryKey: ["inProgress"] }) // 데이터 갱신 후 자동으로 UI 업데이트
            }
        }
    })
};

