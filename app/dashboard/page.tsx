import SessionData from "@/components/UserCpmponents/sessionData";
import ShowPlans from "@/components/UserCpmponents/showPlans";
import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
const getSessionData = async () => {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/SessionWeek`, {
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
const getExercisePlans = async () => {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/exercisePlans`, {
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

export default async function Dashboard() {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({ queryKey: ['weekSessions'], queryFn: getSessionData }),
    queryClient.prefetchQuery({ queryKey: ['exercisePlans'], queryFn: getExercisePlans }),
  ])



  return (
    <section className="flex flex-1 flex-col gap-4 p-4 ">
      <HydrationBoundary>

        <SessionData />
        <ShowPlans />
      </HydrationBoundary>
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