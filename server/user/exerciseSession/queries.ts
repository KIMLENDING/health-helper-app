import { ExerciseSession } from "@/utils/util";
import { useQuery } from "@tanstack/react-query";



/**
 * * /api/user/exerciseSession
 * inProgress 상태인 가장 최근 세션조회
 * @returns 
 */
export const useInProgress = () => {
    return useQuery({
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
            return response.json();
        }
    });
}

/**
 * * /api/user/exerciseSession/[sessionid]
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
 *  detail페이지에서 기록 조회
 * * * /api/user/exerciseSession/all
 * @param year 
 * @param month 
 * @param page 
 * @param limit 
 * @returns 
 */
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