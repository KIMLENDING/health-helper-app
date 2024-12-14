

import * as React from "react"
import {
  Blocks,
  Calendar,
  Home,
  Inbox,
  MessageCircleQuestion,
  Settings2,
  Sparkles,
  Trash2,
} from "lucide-react"

import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { useSession } from "next-auth/react"
import { DefaultUser } from "next-auth"
import Link from "next/link"
import { NavUser } from "./nav-user"
import { NavMain } from "./nav-main"
import { SearchForm } from "./search-form"
import LoadingSpinner from "./LayoutCompents/LoadingSpinner"
import { useState } from "react"
import { useSessionContext } from "@/providers/SessionContext"


// This is sample data.
const data = {
  navMain: [
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: Search,
    // },
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
      // isActive: true,
    },
    {
      title: "운동 루틴 생성",
      url: "/dashboard/user/createPlan",
      icon: Home,
      // isActive: true,
    },
    {
      title: "운동 기록",
      url: "/dashboard/detail",
      icon: Home,
      // isActive: true,
    },

    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
      badge: "100",
    },
  ],
  navSecondary: [
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Templates",
      url: "#",
      icon: Blocks,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],

}
const AdminData = {
  navMain: [
    {
      title: "홈",
      url: "/dashboard",
      icon: Home,
      // isActive: true,
    },
    {
      title: "운동 추가",
      url: "/dashboard/admin/addExercise",
      icon: Sparkles,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
      badge: "100",
    },
  ],
  navSecondary: [
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Templates",
      url: "#",
      icon: Blocks,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],

}
interface CustomSession extends DefaultUser {
  role: string
}
export function SidebarLeft({

  ...props
}: any) {//
  const { data: session, status: sessionStatus } = useSession();
  const { session: sessions } = useSessionContext(); // 서버컴포넌트에서 받은 세션 데이터
  const [datas, setData] = useState(data) // 메뉴 데이터
  const [sessionData, setSession] = useState(sessions) // 세션 데이터


  React.useLayoutEffect(() => {
    if (sessionStatus === "authenticated") { // 인증된 상태일 때
      setSession(session) // 
    }
  }
    , [sessionStatus, session])
  React.useLayoutEffect(() => {
    if (sessionData?.user?.role === "user" && setData(data))
      sessionData?.user?.role === "admin" && setData(AdminData)
  }
    , [sessionData])


  return (
    <Sidebar className="border-r-0 " {...props}>
      <SidebarHeader className="bg-zinc-300 dark:bg-inherit">

        {sessionData ? <NavUser user={{
          name: sessionData.user?.name || "Unknown",
          email: sessionData.user?.email || "unknown@example.com",
          image: sessionData.user?.image || "/img/defaultUserImage.png",
          role: (sessionData.user as CustomSession)?.role || "user",
        }} /> :
          sessionStatus === "loading" ? <div className="flex justify-center"><LoadingSpinner className="w-8 h-8 " /></div> :
            <Button className="p-0">
              <Link href={'/login'} className=" flex-1 h-full pt-2 ">
                로그인
              </Link>
            </Button>
        }
        <SearchForm />
        {sessionData?.user?.role === "admin" ? <NavMain items={AdminData.navMain} /> : <NavMain items={data.navMain} />}

      </SidebarHeader>
      <SidebarContent className="bg-zinc-300 dark:bg-inherit">
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
