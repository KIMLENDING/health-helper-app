import ShowExercisePlan from '@/components/UserCpmponents/showExercisePlan'
import { fetchWithCookie } from '@/utils/fetchUrl';
import getQueryClient from '@/utils/getQueryClient';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';



const fetchData = async () => {
    const cookieHeader = await cookies();
    const cookieName =
        process.env.NODE_ENV === "production"
            ? "__Secure-next-auth.session-token"
            : "next-auth.session-token";
    const cookie = cookieHeader.get(cookieName);
    return await fetchWithCookie(`${process.env.NEXTAUTH_URL}/api/user/exercisePlan`, cookieName, cookie?.value)
};

const page = async () => {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery({ queryKey: ["exercisePlans"], queryFn: () => fetchData() });

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ShowExercisePlan />
            </HydrationBoundary>
        </div>
    )
}

export default page