import { AppSidebar } from "@/components/app-sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { BellRing } from "lucide-react"

export default function AppMainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center justify-between gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Button variant="outline" className="relative">
              <BellRing />
              <Badge className="absolute -top-3 -right-2 text-xs">6</Badge>
            </Button>
          </div>
        </header>
        <section className="mx-5">
            {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  )
}
