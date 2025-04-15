'use client'

import {
  Blocks,
  Calendar,
  Home,
  ClipboardPlus,
  History,
  Inbox,
  MessageCircleQuestion,
  Settings2,
  Sparkles,
  Trash2,
  FlagIcon,
  PlusSquareIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"

import { NavUser } from "./nav-user"
import { NavMain } from "./nav-main"
import { useSession } from "next-auth/react"




// This is sample data.
const menuItems = {
  navMain: [
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: Search,
    // },
    {
      title: "홈",
      url: "/dashboard",
      icon: Home,
      // isActive: true,
    },
    {
      title: "운동 플랜",
      url: "/dashboard/exercisePlans",
      icon: FlagIcon,
      // isActive: true,
    },
    {
      title: "운동 루틴 생성",
      url: "/dashboard/user/createPlan",
      icon: PlusSquareIcon,
      // isActive: true,
    },
    {
      title: "운동 기록",
      url: "/dashboard/detail",
      icon: History,
      // isActive: true,
    },


  ],
  navSecondary: [
    {
      title: "캘린더",
      url: "#",
      icon: Calendar,
    },
    {
      title: "설정",
      url: "#",
      icon: Settings2,
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
interface CustomSession {
  name: string
  email: string
  image: string
  role: string
}
export function SidebarLeft() {
  const { data: session } = useSession()

  return (
    <Sidebar className="border-r-0 " variant='floating'  >
      <SidebarHeader className="bg-zinc-300 dark:bg-inherit">
        {session && <NavUser user={{
          name: (session.user as CustomSession)?.name || "Unknown",
          email: (session.user as CustomSession)?.email || "unknown@example.com",
          image: (session.user as CustomSession)?.image || "/img/defaultUserImage.png",
          role: (session.user as CustomSession)?.role || "user",
        }} />
        }
        {/* <SearchForm /> */}
        {session?.user?.role === "admin" ? <NavMain items={AdminData.navMain} /> : <NavMain items={menuItems.navMain} />}

      </SidebarHeader>
      <SidebarContent className="bg-zinc-300 dark:bg-inherit">
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
    </Sidebar>
  )
}
