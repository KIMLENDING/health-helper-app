
import ShowChart from "@/components/UserCpmponents/showChart";
import ShowPlans from "@/components/UserCpmponents/showPlans";
import ShowWeek from "@/components/UserCpmponents/showWeek";
import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { cookies } from "next/headers";

const fetchData = async () => {
  const cookieHeader = await cookies();
  const cookieName =
    process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";
  const cookie = cookieHeader.get(cookieName);
  console.log("🔍 서버에서 받은 쿠키: next-auth.session-token", cookie);
  console.log("🔍 서버에서 받은 쿠키:", cookieHeader);
  console.log(' 쿠키 이름:', cookieName)
  console.log(' 쿠키 값:', cookie?.value)
  if (!cookie) {
    return { sessionData: 0, exercisePlans: 0 };
  }
  const getSessionData = async () => {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/SessionWeek`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Cookie': cookie ? `next-auth.session-token=${cookie.value}` : '',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
  const getExercisePlan = async () => {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exercisePlan`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie ? `next-auth.session-token=${cookie.value}` : '',
      },

      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
  const [sessionData, exercisePlans] = await Promise.all([getSessionData(), getExercisePlan()]);
  return { sessionData, exercisePlans };
}


export default async function Dashboard() {
  const { sessionData, exercisePlans } = await fetchData();
  // const queryClient = new QueryClient();
  // await Promise.all([
  //   queryClient.prefetchQuery({ queryKey: ['weekSessions'], queryFn: async () => sessionData }),
  //   queryClient.prefetchQuery({ queryKey: ['exercisePlans'], queryFn: async () => exercisePlans }),
  // ])

  return (
    <section className="flex flex-1 flex-col gap-4 p-4 ">
      {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
      <div className='flex  flex-col gap-4'>
        <ShowWeek />
        <ShowChart />
      </div>
      <ShowPlans />
      {/* </HydrationBoundary> */}
    </section>
  );
}




// import { cookies } from "next/headers";
//
// getServerSession으로는  useSession으로 가져올 수 있는 데이터를 가져올 수 없다.
// 그래서 우회 방법으로로 fetch를 사용하여 데이터를 가져온다.

// async function useGetSession() {
//   const cookieHeader = await cookies();
//   const cookie = cookieHeader.get('next-auth.session-token');
//   console.log(cookieHeader)
//   const res = await fetch("http://localhost:3000/api/auth-token", {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json', 'Cookie': cookie ? `next-auth.session-token=${cookie.value}` : '',
//     },
//   }).then((res) => res.json());
//   return res;
// }