'use client'
import { ModeToggle } from "@/components/LayoutCompents/ModeToggle"
import { SidebarLeft } from "@/components/sidebar-left"
import { SidebarRight } from "@/components/sidebar-right"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { usePathname } from "next/navigation"

const routers = [
  {
    url: "/dashboard",
    name: "Home"
  },
  {
    url: "/dashboard/user/createPlan",
    name: "운동 루틴 생성"
  },
  {
    url: "/dashboard/admin/addExercise",
    name: "운동 추가"
  },
  {
    url: "/dashboard/admin/exercise",
    name: "운동 관리"
  },
  {
    url: "/dashboard/admin/plan",
    name: "운동 계획"
  },
  {
    url: "/dashboard/admin/user",
    name: "사용자 관리"
  },
  {
    url: "/dashboard/admin/setting",
    name: "설정"
  },
]
export default function DachboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background z-50 shadow-md">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <ModeToggle />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    {pathname === "/" ? "Home" : routers.find(route => route.url === pathname)?.name || "Page"}

                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {children}
      </SidebarInset>
      <SidebarRight />

    </SidebarProvider>
  )
}

// export const getServerSideProps: GetServerSideProps = async () => {
//   const res = await fetch('/api/auth');
//   const data = await res.json();
//   console.log('data', data)
//   return {
//     props: {
//       data,
//     },
//   };
// };