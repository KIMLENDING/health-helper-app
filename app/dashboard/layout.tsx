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
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ArrowBigLeft, ChevronLeft, ChevronRight } from "lucide-react"

import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

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
    url: "/dashboard/exercisePlans",
    name: "플랜 목록"
  },
  {
    url: "/dashboard/admin/setting",
    name: "설정"
  },
  {
    url: "/dashboard/exerciseSession",
    name: "운동 세션"
  }
]
export default function DachboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const sortedRouters = [...routers].sort((a, b) => b.url.length - a.url.length);

  const goForward = () => {
    window.history.forward();
  };
  const getRouteName = () => {
    return sortedRouters.find(route => pathname.startsWith(route.url))?.name || "Page";
  }

  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background z-50 shadow-md">
          <div className="flex flex-1 items-center gap-2 px-3 justify-between">

            <div className="flex  items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className=" h-4" />
              <ModeToggle />
            </div>
            <div className="flex items-center gap-2 px-3">
              <Button onClick={() => router.back()} variant="outline" size="icon" className="shadow-none ring-0 border-0 focus-visible:ring-0 w-7 h-7">
                <ChevronLeft className="h-[1.2rem] w-[1.2rem]" />
              </Button>
              <Separator orientation="vertical" className=" h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="line-clamp-1">
                      {getRouteName()}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <Separator orientation="vertical" className=" h-4" />
              <Button onClick={goForward} variant="outline" size="icon" className="shadow-none ring-0 border-0 focus-visible:ring-0 w-7 h-7">
                <ChevronRight className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </div>
          </div>
        </header>
        {children}
      </SidebarInset>
      <SidebarRight />

    </SidebarProvider>
  )
}

