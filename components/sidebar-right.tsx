'use client'
import * as React from "react"
import { Plus } from "lucide-react"

import { Calendars } from "@/components/calendars"
import { DatePicker } from "@/components/date-picker"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"



export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status: sessionStatus } = useSession();

  if (sessionStatus === "loading" || !session) {
    return null;
  }
  return (
    <Sidebar
      collapsible="none"
      className="sticky hidden lg:flex top-0 h-svh border-l "
      {...props}
    >

      <SidebarContent className="bg-zinc-300 dark:bg-inherit">
        <DatePicker />
        <SidebarSeparator className="mx-0" />

      </SidebarContent>

    </Sidebar>
  )
}
