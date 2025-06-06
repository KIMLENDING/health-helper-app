import Floating from "@/components/floating"
import { ModeToggle } from "@/components/LayoutCompents/ModeToggle"

import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { fetchWithCookie } from "@/utils/fetchUrl";
import { cookies } from "next/headers";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/utils/getQueryClient";
import LeftSideBar from "@/components/LayoutCompents/LeftSideBar"
import { DrawerDialogActionWithStore } from "@/components/UserCpmponents/DynamicComponents";


const fetchData = async () => {
  const cookieHeader = await cookies();
  const cookieName =
    process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";
  const cookie = cookieHeader.get(cookieName);
  return await fetchWithCookie(`${process.env.NEXTAUTH_URL}/api/user/exerciseSession`, cookieName, cookie?.value)
};

export default async function DachboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({ queryKey: ["inProgress"], queryFn: () => fetchData() });

  return (
    <SidebarProvider>
      <LeftSideBar />
      <SidebarInset>
        <main className="h-screen overflow-y-auto scrollbar-hide">
          <header className="sticky top-0 flex justify-between h-14 shrink-0 items-center gap-2 bg-background z-50 shadow-md px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-4" />
              <ModeToggle />
            </div>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <Floating />
            </HydrationBoundary>
          </header>
          {children}
        </main>
        <DrawerDialogActionWithStore />
      </SidebarInset>
    </SidebarProvider>
  )
}