import { useQuery } from "@tanstack/react-query";

export const useEexercises = () => {
    return useQuery({
        queryKey: ['exercises'],
        queryFn: async () => {
            const response = await fetch('/api/admin/exercise', {
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