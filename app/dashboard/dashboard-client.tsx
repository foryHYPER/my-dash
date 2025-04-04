"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Role } from "@/lib/supabase/profiles"

interface User {
  name: string
  email: string
  avatar: string
  role: Role
}

interface DashboardClientProps {
  user: User
  children: React.ReactNode
}

export default function DashboardClient({ user, children }: DashboardClientProps) {
  return (
    <div className="[--header-height:3.5rem]">
      <SidebarProvider defaultOpen={true} className="flex flex-col h-screen">
        <SiteHeader />
        <div className="flex flex-1 h-[calc(100vh-3.5rem)]">
          <AppSidebar user={user} />
          <SidebarInset>
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
} 