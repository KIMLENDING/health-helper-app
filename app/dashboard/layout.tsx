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
import { useInProgress } from "@/server/queries"
import { ChevronLeft, ChevronRight, Divide, Dumbbell } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"


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
  const { data, isLoading, isError } = useInProgress();
  const sortedRouters = [...routers].sort((a, b) => b.url.length - a.url.length);
  useEffect(() => { }, [data])
  const handleClick = () => {
    if (data)
      router.push(`/dashboard/exerciseSession/${data._id}`);
  };
  const goForward = () => {
    window.history.forward();
  };
  const getRouteName = () => {
    return sortedRouters.find(route => pathname.startsWith(route.url))?.name || "Page";
  }
  console.log(data?.exercises)
  return (
    <SidebarProvider >
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

        {data &&
          <header className="sticky bottom-5 flex h-24 shrink-0 items-center gap-2 mx-8 bg-zinc-100 dark:bg-zinc-800  z-50 shadow-md rounded-3xl border-2 border-neutral-400 dark:border-neutral-700">
            <div className="px-2 flex flex-row gap-2 flex-1 items-center ">
              진행중인 운동:
              <Button onClick={handleClick} variant="default" className="flex-1"  >
                <Dumbbell className="h-7 w-7" />
                <div>{data.exercises?.map((items, index) => (
                  <div key={index}>{items.state === 'inProgress' && items.title}</div>
                ))}
                </div>
              </Button>
            </div>
          </header>
        }
      </SidebarInset>


      <SidebarRight />

    </SidebarProvider>
  )
}

