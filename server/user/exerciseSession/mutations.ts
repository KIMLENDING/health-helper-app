import { toast } from "@/hooks/use-toast";
import { ExerciseSessionActionPayload, ExerciseSessionSetPayload } from "@/utils/util";
import { useMutation, useQueryClient } from "@tanstack/react-query";



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
            // 모든 운동을 완료 했기 때문에 inProgress 쿼리 갱신을 위한 무효화
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1 필요
            queryClient.invalidateQueries({ queryKey: ["allSessions", year, month, 1] }) // detail페이지의 데이터 업데이트
            await queryClient.invalidateQueries({ queryKey: ["inProgress"] });
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
