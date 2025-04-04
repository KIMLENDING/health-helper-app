
import Floating from "@/components/floating"
import { ModeToggle } from "@/components/LayoutCompents/ModeToggle"
import { SidebarLeft } from "@/components/sidebar-left"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DachboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <SidebarProvider >
      <SidebarLeft />
      <SidebarInset>
        <main>
          <header className=" sticky top-0 flex justify-between h-14 shrink-0 items-center gap-2 bg-background z-50 shadow-md px-4">
            <div className="flex items-center gap-2  ">
              <SidebarTrigger />
              <Separator orientation="vertical" className=" h-4" />
              <ModeToggle />
            </div>
            <Floating />
          </header>
          {children}
        </main>
      </SidebarInset>
      {/* <SidebarRight /> */}
    </SidebarProvider>
  )
}

