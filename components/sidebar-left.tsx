'use client'

import {
  Blocks,
  Calendar,
  Home,
  History,
  Inbox,
  MessageCircleQuestion,
  Settings2,
  Sparkles,
  Trash2,
  FlagIcon,
  PlusSquareIcon,
  Search,
} from "lucide-react"

import {
  Sidebar,
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
}
interface CustomSession {
  name: string
  email: string
  image: string
  role: string
}
const SidebarLeft = () => {
  const { data: session } = useSession()

  return (
    <Sidebar className="border-r-0  " variant='floating'  >
      <SidebarHeader className=" dark:bg-inherit">
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

    </Sidebar>
  )
}

export default SidebarLeft;