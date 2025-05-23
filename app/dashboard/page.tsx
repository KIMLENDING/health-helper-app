import ShowChart from "@/components/UserCpmponents/showChart";
import ShowPlans from "@/components/UserCpmponents/showPlans";
import ShowWeek from "@/components/UserCpmponents/showWeek";
import { fetchWithCookie } from "@/utils/fetchUrl";
import getQueryClient from "@/utils/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";
// import { ShowChart } from "@/components/UserCpmponents/DynamicComponents";  // 동적 import
const fetchData = async () => {
  const cookieHeader = await cookies();
  const cookieName =
    process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";
  const cookie = cookieHeader.get(cookieName);

  const [sessionData, exercisePlans] = await Promise.all([
    fetchWithCookie(`${process.env.NEXTAUTH_URL}/api/user/SessionWeek`, cookieName, cookie?.value),
    fetchWithCookie(`${process.env.NEXTAUTH_URL}/api/user/exercisePlan`, cookieName, cookie?.value),
  ]);

  return { sessionData, exercisePlans };
};

export default async function Dashboard() {
  const { sessionData, exercisePlans } = await fetchData();
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({ queryKey: ["weekSessions"], queryFn: () => sessionData }),
    queryClient.prefetchQuery({ queryKey: ["exercisePlans"], queryFn: () => exercisePlans }),
  ]);

  return (
    <section className=" flex shrink-0 flex-col gap-4 p-4 ">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex flex-col ">
          <ShowWeek />
          <ShowChart />
        </div>
        <ShowPlans />
      </HydrationBoundary>
    </section>
  );
}
