import { ExercisePlan } from "@/utils/util";
import { useQuery, } from "@tanstack/react-query";

/**
 * * api/user/exercisePlan
 *  userId로 해당 유저의 운동 계획 조회
 * @param userId 
 * @returns 
 */
export const useExercisePlan = () => {
    return useQuery<ExercisePlan[]>({
        queryKey: ["exercisePlans"],
        queryFn: async () => {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exercisePlan`, {
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
 * * api/user/exercisePlan/[planId]
 * 특정 운동 계획 조회
 * @param planId 
 * @returns 
 */
export const useExercisePlanById = (id: string) => {
    // const QueryClient = useQueryClient();
    return useQuery<ExercisePlan>({
        queryKey: ["exercisePlan", id],
        queryFn: async () => {


            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exercisePlan/${id}`);
            if (!res.ok) throw new Error("Failed to fetch plan");
            return res.json();
        },
        enabled: !!id,// id가 있을 때만 쿼리 실행
    });
};