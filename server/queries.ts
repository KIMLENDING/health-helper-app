
import { Exercise, ExercisePlan, ExerciseSession } from "@/utils/util";

import { useQuery } from "@tanstack/react-query";

/** 컴포넌트간 데이터를 받아오기 위한 기능 */
export const useSelectedExercises = () => {
    return useQuery<Exercise[]>({
        queryKey: ["selectedExercise"],
        initialData: [],
        enabled: false, // 서버 요청 없이 local 데이터만 사용
    });
};


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
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return response.json();
        }
    });
}



