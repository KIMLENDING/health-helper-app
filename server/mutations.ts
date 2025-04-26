
import { toast } from "@/hooks/use-toast";
import { Exercise, ExerciseOption, ExercisePlan, ExerciseSession, ExerciseSessionActionPayload, ExercisesessionData, ExerciseSessionSetPayload, PostExerciseSession } from "@/utils/util";
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
                toast({ variant: 'default2', title: `${data.message}` });
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
        onSuccess: async (data) => {
            toast({ variant: 'default2', title: `${data.message}` });
            await queryClient.invalidateQueries({ queryKey: ["exercisePlans"] }) // 데이터 갱신 후 자동으로 UI 업데이트
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : String(error);
            console.error("onError", error);
            toast({ variant: "destructive", title: message });
        },
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
        onSuccess: async (data) => {
            toast({ variant: 'default2', title: `${data.message}` });
            await queryClient.invalidateQueries({ queryKey: ["exercisePlans"] }) // 데이터 갱신 후 자동으로 UI 업데이트
            queryClient.removeQueries({ queryKey: ["exercisePlan", data] })
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
 * 사용자 전용 운동 계획 수정 Mutation
 * @description 운동 계획을 수정하는 Mutation입니다. 운동계획의 제목, 세부 운동 목록의 세트, 반복, 무게를 수정합니다.
 * @param exercisePlanId - 수정할 운동 계획의 ID입니다. 
 * @param title - 수정할 운동 계획의 제목입니다.
 * @param exercises - 수정할 운동 계획의 세부 운동 목록입니다. 각 운동의 ID, 세트, 반복, 무게를 포함합니다.
 * @returns
*/
export const useEditPlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exercisePlan/${data.exercisePlanId}`, {
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
        onSuccess: async (data) => {
            toast({ variant: 'default2', title: `${data.message}${data.data._id}` });
            await queryClient.invalidateQueries({ queryKey: ["exercisePlan", data.data._id] })
            await queryClient.invalidateQueries({ queryKey: ["exercisePlans"] })
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : String(error);
            console.error("onError", error);
            toast({ variant: "destructive", title: message });
        },
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
        onSuccess: async (data) => {
            queryClient.setQueryData(["selectedExercise"], data); // 데이터 저장

        },
        onError: (error) => {
            console.log('onError', error);
        },
        onSettled: async (data, error) => {
            await queryClient.invalidateQueries({ queryKey: ["selectedExercise"] })
        }
    })
}


/**
 *  사용자 전용 운동 플랜에 운동 추가가 Mutation
 * @returns 
 */

export const useUpdatePlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exercisePlan`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(data)
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
                toast({ variant: 'default2', title: `${data.message}` });
                await queryClient.invalidateQueries({ queryKey: ["exercisePlans"] }) // 데이터 갱신 후 자동으로 UI 업데이트
                await queryClient.invalidateQueries({ queryKey: ["exercisePlan", data.data._id] }) // 데이터 갱신 후 자동으로 UI 업데이트
                await queryClient.resetQueries({ queryKey: ["selectedExercise"] }); // 캐시된 데이터를 초기화합니다.
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
 * //*  2025/04/09-03:51 수정 
 * 운동 세션 생성 Mutation
 * @description 운동 세션을 생성하는 Mutation입니다. 운동 계획에 따라 세션을 생성합니다.
 * @param exerciseSession - 운동 세션의 정보를 담고 있는 객체입니다.
*/
export const useCreateExerciseSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exerciseSession`, {
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
        onSuccess: async (data) => {
            toast({ variant: "default2", title: "운동을 시작합니다!" });
            await queryClient.invalidateQueries({ queryKey: ["exerciseSession", data.newExerciseSession._id] }) // 데이터 갱신 후 자동으로 UI 업데이트
            await queryClient.invalidateQueries({ queryKey: ["inProgress"] }) // 데이터 갱신 후 자동으로 UI 업데이트
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : String(error);
            console.error("onError", error);
            toast({ variant: "destructive", title: message });
        },
    })
};


/**
 * //*  2025/04/09-03:51 수정 
 * 운동 세션 상태 변경 Mutation
 * @description 운동 세션의 상태를 변경하는 Mutation입니다. 운동 ('시작' || '종료' || '세트 완료') 등의 작업을 수행합니다.
 * @param data - 운동 세션의 ID와 운동 ID, 상태 변경 작업('start' || 'done' || 'end')을 포함하는 객체입니다.
 * @returns 
 */
export const useActionExerciseSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: ExerciseSessionActionPayload) => {
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
        onSuccess: async (data) => {
            toast({ variant: "default2", title: "운동 상태가 업데이트되었습니다." });
            // invalidate 관련 로직은 성공 시 처리하는 게 더 명확
            await queryClient.invalidateQueries({ queryKey: ["exerciseSession", data.exerciseSession._id] });
            // await queryClient.invalidateQueries({ queryKey: ["inProgress"] }); //*  2025/04/09-03:51 수정 
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : String(error);
            console.error("onError", error);
            toast({ variant: "destructive", title: message });
        },
    })
};

/**
 *  //*  2025/04/09-03:51 수정 
 * 운동 세션 모두 완료 Mutation
 * @returns 
 */
export const useDoneExerciseSession = () => {

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
        onSuccess: async (data) => {
            toast({ variant: 'default2', title: `${data.message}` });
            queryClient.invalidateQueries({ queryKey: ["inProgress"] }) // 모든 운동을 완료 했기 때문에 inProgress 쿼리 갱신을 위한 무효화화
            if (data.updatedSession) { // 데이터가 있을 경우에만 invalidateQueries 호출
                await queryClient.invalidateQueries({ queryKey: ["exerciseSession", data.updatedSession._id] }) // 데이터 갱신 후 자동으로 UI 업데이트
            }
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : String(error);
            console.error("onError", error);
            toast({ variant: "destructive", title: message });
        },

    })
};

/**
 * 무게, 횟수 변경 Mutation
 * @returns 
 */
export const useEditExerciseSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: ExerciseSessionSetPayload) => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exerciseSession/${payload.sessionId}/${payload.exerciseId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return response.json();
        },
        onSuccess: async (data) => {
            toast({ variant: 'default2', title: data.message });
            await queryClient.invalidateQueries({ queryKey: ['exerciseSession', data.updatedSession._id] })
        },
        onError: (error: any) => {
            const message = error instanceof Error ? error.message : String(error);
            console.error("onError", error);
            toast({ variant: "destructive", title: message });
        },
    })
};

