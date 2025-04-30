import TapsComponent from "@/components/UserCpmponents/Taps/TapsComponent";
import { fetchWithCookie } from "@/utils/fetchUrl";
import getQueryClient from "@/utils/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";


const fetchData = async (sessionId: string) => {
    const cookieHeader = await cookies();
    const cookieName =
        process.env.NODE_ENV === "production"
            ? "__Secure-next-auth.session-token"
            : "next-auth.session-token";
    const cookie = cookieHeader.get(cookieName);
    return await fetchWithCookie(`${process.env.NEXTAUTH_URL}/api/user/exerciseSession/${sessionId}`, cookieName, cookie?.value);
};
const Page = async ({ params }: { params: Promise<{ sessionId: string }> }) => {
    const { sessionId } = await params;  // 세션 아이디
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery({ queryKey: ["exerciseSession", sessionId], queryFn: () => fetchData(sessionId) });


    return (
        <div className='mx-auto w-full h-full   flex-1  max-w-4xl  py-4'>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <TapsComponent sessionId={sessionId} />
            </HydrationBoundary>
        </div>
    )
}

export default Page
