import { useQuery } from "@tanstack/react-query";

/**
 * api/admin/exercise에서 운동 종목 전체 조회
 * @returns 운동 종목 전체 조회
 */
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