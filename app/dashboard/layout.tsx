import Floating from "@/components/floating"
import { ModeToggle } from "@/components/LayoutCompents/ModeToggle"

import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cookies } from "next/headers";
import { SidebarLeft } from "@/components/sidebar-left";

const fetchWithCookie = async (url: string, cookieName: string, cookieValue: string | undefined) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cookie": cookieValue ? `${cookieName}=${cookieValue}` : "",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

async function getSessionData() {
  const cookieHeader = await cookies();
  const cookieName =
    process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";
  const cookie = cookieHeader.get(cookieName);
  return fetchWithCookie(`${process.env.NEXTAUTH_URL}/api/auth-token`, cookieName, cookie?.value);
}

export default async function DachboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionData = await getSessionData();

  return (
    <SidebarProvider>
      <SidebarLeft sessionData={sessionData} />
      <SidebarInset>
        <main>
          <header className="sticky top-0 flex justify-between h-14 shrink-0 items-center gap-2 bg-background z-50 shadow-md px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-4" />
              <ModeToggle />
            </div>
            <Floating />
          </header>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}