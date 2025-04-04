"use client"

import React from "react"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { 


  Briefcase, 
  Building2, 
  Calendar, 

  FileText, 
  Frame, 
  LifeBuoy, 
  Map, 
  PieChart, 
  Send, 

  SquareTerminal,
  User
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Role } from "@/lib/supabase"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigationData = {
  admin: {
    navMain: [
      {
        title: "Dashboard",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Übersicht",
            url: "/dashboard/admin",
          },
          {
            title: "Benutzer",
            url: "/dashboard/admin/users",
          },
          {
            title: "Einstellungen",
            url: "/dashboard/admin/settings",
          },
        ],
      },
    ],
  },
  candidate: {
    navMain: [
      {
        title: "Dashboard",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Übersicht",
            url: "/dashboard/candidate",
          },
          {
            title: "Meine Bewerbungen",
            url: "#",
          },
          {
            title: "Gemerkte Stellenangebote",
            url: "#",
          },
        ],
      },
      {
        title: "Profil",
        url: "#",
        icon: User,
        items: [
          {
            title: "Persönliche Daten",
            url: "/dashboard/candidate/profile",
          },
          {
            title: "Qualifikationen",
            url: "/candidate/profile/skills",
          },
          {
            title: "Berufserfahrung",
            url: "/candidate/profile/experience",
          },
          {
            title: "Bildungsweg",
            url: "/candidate/profile/education",
          },
        ],
      },
      {
        title: "Bewerbungen",
        url: "#",
        icon: FileText,
        items: [
          {
            title: "Laufende Bewerbungen",
            url: "/dashboard/candidate/applications",
          },
          {
            title: "Bewerbungsverlauf",
            url: "/dashboard/candidate/applications/history",
          },
          {
            title: "Bewerbungsübersicht",
            url: "/dashboard/candidate/applications/kanban",
          },
        ],
      },
      {
        title: "Vorstellungsgespräche",
        url: "/dashboard/candidate/interviews",
        icon: Calendar,
      },
    ],
  },
  company: {
    navMain: [
      {
        title: "Dashboard",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Übersicht",
            url: "/dashboard/company",
          },
          {
            title: "Aktive Stellenangebote",
            url: "/dashboard/company/jobs",
          },
          {
            title: "Bewerbungen",
            url: "#",
          },
          {
            title: "Terminkalender",
            url: "/dashboard/company/appointments",
          },
        ],
      },
      {
        title: "Stellenangebote",
        url: "/dashboard/company/jobs",
        icon: Briefcase,
        items: [
          {
            title: "Stellenangebote verwalten",
            url: "/dashboard/company/jobs",
          },
          {
            title: "Bewerber",
            url: "/dashboard/company/candidates",
          },
        ],
      },
      {
        title: "Unternehmen",
        url: "#",
        icon: Building2,
        items: [
          {
            title: "Unternehmensprofil",
            url: "/dashboard/company/profile",
          },
          {
            title: "Team-Mitglieder",
            url: "#",
          },
          {
            title: "Einstellungen",
            url: "#",
          },
        ],
      },
    ],
  },
  navSecondary: [
    {
      title: "Support",
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

interface User {
  name: string
  email: string
  avatar: string
  role: Role
}

interface AppSidebarProps {
  user: User
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error logging out:', error.message)
        return
      }
      router.push('/login')
    } catch (error) {
      console.error('Error in logout:', error)
      router.push('/login')
    }
  }

  const validRole = user.role === 'candidate' || user.role === 'company' ? user.role : 'candidate'

  const navigation = {
    navMain: navigationData[validRole]?.navMain || [],
    navSecondary: navigationData.navSecondary,
    projects: navigationData.projects,
  }

  return (
    <Sidebar 
      className="h-[calc(100vh-3.5rem)] border-r sticky top-[3.5rem]"
      {...props}
    >
      <SidebarHeader className="pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image 
                    src="/logo.png" 
                    alt="RE-24 JOBS" 
                    className="h-5 w-auto" 
                    width={20}
                    height={20}
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">RE24 JOBS</span>
                  <span className="truncate text-xs">{validRole}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Main navigation items */}
        <NavMain items={navigation.navMain} />
        
        {/* Projects section if available */}
        {navigation.projects && navigation.projects.length > 0 && (
          <NavProjects projects={navigation.projects} />
        )}
        
        {/* Secondary navigation with mt-auto to push it down but above footer */}
        <NavSecondary items={navigation.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {/* User information at the bottom */}
        <NavUser 
          user={{
            name: user.name || user.email,
            email: user.email,
            avatar: user.avatar || ''
          }}
          onLogout={handleLogout}
        />
      </SidebarFooter>
    </Sidebar>
  )
} 