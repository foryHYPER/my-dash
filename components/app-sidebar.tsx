"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Building2,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  User,
} from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Base data structure
const allNavData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Spielwiese",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      roles: ["admin"],
      items: [
        {
          title: "Verlauf",
          url: "#",
        },
        {
          title: "Favoriten",
          url: "#",
        },
        {
          title: "Einstellungen",
          url: "#",
        },
      ],
    },
    {
      title: "Unternehmen",
      url: "/dashboard/company",
      icon: Building2,
      roles: ["company", "admin"],
      items: [
        {
          title: "Dashboard",
          url: "/dashboard/company",
        },
        {
          title: "Stellenangebote",
          url: "/dashboard/company/jobs",
        },
        {
          title: "Kandidaten",
          url: "/dashboard/company/candidates",
        },
        {
          title: "Termine",
          url: "/dashboard/company/appointments",
        },
        {
          title: "Profil",
          url: "/dashboard/company/profile",
        },
      ],
    },
    {
      title: "Kandidat",
      url: "/dashboard/candidate",
      icon: User,
      roles: ["candidate", "admin"],
      items: [
        {
          title: "Dashboard",
          url: "/dashboard/candidate",
        },
        {
          title: "Bewerbungen",
          url: "/dashboard/candidate/applications",
        },
        {
          title: "Vorstellungsgespräche",
          url: "/dashboard/candidate/interviews",
        },
        {
          title: "Profil",
          url: "/dashboard/candidate/profile",
        },
      ],
    },
    {
      title: "Modelle",
      url: "#",
      icon: Bot,
      roles: ["admin"],
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Dokumentation",
      url: "#",
      icon: BookOpen,
      roles: ["admin", "company", "candidate"],
      items: [
        {
          title: "Einführung",
          url: "#",
        },
        {
          title: "Erste Schritte",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Änderungsprotokoll",
          url: "#",
        },
      ],
    },
    {
      title: "Einstellungen",
      url: "#",
      icon: Settings2,
      roles: ["admin", "company", "candidate"],
      items: [
        {
          title: "Allgemein",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Abrechnung",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Hilfe",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Funnel 1",
      url: "#",
      icon: Frame,
    },
    {
      name: "Funnel 2",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Funnel 3",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ 
  user,
  ...props 
}: { 
  user?: { 
    name: string
    email: string
    avatar: string
    role: string
  }
} & React.ComponentProps<typeof Sidebar>) {
  const [userRole, setUserRole] = useState<string | null>(user?.role || null)
  const [data, setData] = useState({
    navMain: [] as typeof allNavData.navMain,
    navSecondary: allNavData.navSecondary,
    projects: allNavData.projects,
    user: user || allNavData.user
  })

  useEffect(() => {
    // If user prop is provided, use that role
    if (user?.role) {
      setUserRole(user.role)
      return
    }

    // Otherwise fetch from Supabase
    async function getUserRole() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          // Fetch user profile to get role
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
          
          if (profile?.role) {
            setUserRole(profile.role)
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error)
      }
    }

    getUserRole()
  }, [user])

  useEffect(() => {
    if (userRole) {
      // Filter navigation items based on user role
      const filteredNavMain = allNavData.navMain.filter(item => 
        item.roles && item.roles.includes(userRole)
      )
      
      setData(prevData => ({
        ...prevData,
        navMain: filteredNavMain
      }))
    }
  }, [userRole])

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">RE-24 Jobs</span>
                  <span className="truncate text-xs">Test</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
