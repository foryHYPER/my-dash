"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/client"
import { Role } from "@/lib/supabase"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
    role: "candidate" as Role
  })
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const supabase = createClient()
        
        // Aktuelle Session laden
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Benutzerprofil aus der Datenbank laden
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            
          if (profile) {
            setUser({
              name: profile.full_name || profile.username || session.user.email,
              email: session.user.email || "",
              avatar: profile.avatar_url || "",
              role: profile.role as Role || "candidate"
            })
          }
        }
      } catch (error) {
        console.error("Fehler beim Laden der Benutzerdaten:", error)
      } finally {
        setLoading(false)
      }
    }
    
    loadUserData()
  }, [])
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Lade...</div>
  }

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