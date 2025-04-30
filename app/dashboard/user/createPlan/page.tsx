
import CreatPlanUser from '@/components/UserCpmponents/creatPlanUser'
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

    return await fetchWithCookie(`${process.env.NEXTAUTH_URL}/api/admin/exercise`, cookieName, cookie?.value);

};
const CreatPlan = async () => {
    const ExerciseData = fetchData();
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery({ queryKey: ["exercises"], queryFn: () => ExerciseData });
    return (
        <div className='flex flex-1 flex-col  p-4'>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <CreatPlanUser />
            </HydrationBoundary>
        </div>
    )
}

export default CreatPlan