
import { Exercise, ExercisePlan } from "@/utils/util";

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