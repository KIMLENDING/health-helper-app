
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


/**
 *  userId로 해당 유저의 운동 계획 조회
 * @param userId 
 * @returns 
 */
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


/**
 * 특정 운동 계획 조회
 * @param planId 
 * @returns 
 */
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


/**
 * sessionId로 운동 세션 조회
 * @param sessionId 
 * @returns 
 */
export const useGetExerciseSession = (sessionId?: string) => {
    return useQuery<ExerciseSession>({
        queryKey: ["exerciseSession", sessionId],
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

/**
 * inProgress 상태인 가장 최근 세션조회회
 * @returns 
 */
export const useInProgress = () => {
    return useQuery<ExerciseSession>({
        queryKey: ["inProgress"],
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


/**
 * 전체 운동 세션 조회(운동기록)
 */
// export const useAllSessions = () => {
//     return useQuery({
//         queryKey: ['allSessions'],
//         queryFn: async () => {
//             const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exerciseSession/all`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             });
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             return response.json();
//         }
//     });
// }
export const useAllSessions = (year: number, month: number, page: number, limit: number = 10) => {
    return useQuery({
        queryKey: ['allSessions', year, month, page],
        queryFn: async () => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exerciseSession/all?year=${year}&month=${month}&page=${page}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        },
        gcTime: 1000 * 60 * 60 * 24, // 캐시 유지 시간
        staleTime: Infinity
    });
};
