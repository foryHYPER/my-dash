import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="[--header-height:3.5rem]">
      <SidebarProvider defaultOpen={true} className="flex flex-col h-screen">
        <SiteHeader />
        <div className="flex flex-1 h-[calc(100vh-3.5rem)]">
          <AppSidebar />
          <SidebarInset>
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
} 