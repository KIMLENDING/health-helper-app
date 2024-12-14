
import { Exercise, ExercisePlan, ExerciseSession } from "@/utils/util";

import { useQuery } from "@tanstack/react-query";

export const useEexercises = () => {
    return useQuery({
        queryKey: ['exercises'],
        queryFn: async () => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/exercise`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }
    });
}

/**컴포넌트간 데이터를 받아오기 위한 기능 */
export const getSelectedExercises = () => {
    return useQuery<Exercise[]>( // 타입을 지정합니다.
        {
            queryKey: ["selectedExercise"],
            // 캐싱된 데이터를 바로 가져오기 위해 기본적으로 undefined를 반환
            initialData: [],
        });
};

export const getExercisePlan = (userId?: string) => {
    return useQuery<ExercisePlan[]>({
        queryKey: ["exercisePlans"],
        queryFn: userId ? async () => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        } : undefined,
        enabled: !!userId, // userId가 있을 때만 데이터를 가져옵니다.
    });
}

export const getSpecificExercisePlan = (planId?: string) => {
    return useQuery<ExercisePlan>({
        queryKey: ["exercisePlan", planId], // 개별 데이터를 식별할 수 있는 queryKey
        queryFn: planId ? async () => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exercisePlan/${planId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        } : undefined,
        enabled: !!planId, // planId가 있을 때만 데이터를 가져옵니다.
    });
};


export const useGetExerciseSession = (sessionId?: string) => {
    return useQuery<ExerciseSession>({
        queryKey: ["exerciseSession", sessionId], // 개별 데이터를 식별할 수 있는 queryKey
        queryFn: sessionId ? async () => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exerciseSession/${sessionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        } : undefined,
        enabled: !!sessionId, // planId가 있을 때만 데이터를 가져옵니다.
    });
};

export const useInProgress = () => {
    return useQuery<ExerciseSession>({
        queryKey: ["inProgress"], // 개별 데이터를 식별할 수 있는 queryKey
        queryFn: async () => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exerciseSession`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json().then((data) => {
                console.log(data);
                if (!data.latestSession) {
                    return null;
                }
                return data.latestSession;
            });
        }
    });
}


/**
 * 일주일 운동 세션 조회
 */

export const useWeekSessions = () => {
    return useQuery({
        queryKey: ['weekSessions'],
        queryFn: async () => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/SessionWeek`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }
    });
}