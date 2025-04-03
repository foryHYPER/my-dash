"use client"

import * as React from "react"
import Link from "next/link"
import {
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  SquareTerminal,
  Briefcase,
  User,
  FileText,
  Building2,
  Calendar,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Role } from "@/lib/supabase"

import { NavMain } from "@/components/nav-main"
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
            title: "Bewerbungen",
            url: "#",
          },
          {
            title: "Gespeicherte Jobs",
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
            title: "Fähigkeiten",
            url: "/candidate/profile/skills",
          },
          {
            title: "Erfahrung",
            url: "/candidate/profile/experience",
          },
          {
            title: "Ausbildung",
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
            title: "Aktiv",
            url: "/dashboard/candidate/applications",
          },
          {
            title: "Verlauf",
            url: "/dashboard/candidate/applications/history",
          },
          {
            title: "Kanban",
            url: "/dashboard/candidate/applications/kanban",
          },
        ],
      },
      {
        title: "Terminübersicht",
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
            title: "Aktive Jobs",
            url: "/dashboard/company/jobs",
          },
          {
            title: "Bewerbungen",
            url: "#",
          },
          {
            title: "Termine",
            url: "/dashboard/company/appointments",
          },
        ],
      },
      {
        title: "Jobs",
        url: "/dashboard/company/jobs",
        icon: Briefcase,
        items: [
          {
            title: "Jobs verwalten",
            url: "/dashboard/company/jobs",
          },
          {
            title: "Kandidaten",
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
            title: "Profil",
            url: "/dashboard/company/profile",
          },
          {
            title: "Team",
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

export function AppSidebar({ user }: AppSidebarProps) {
  const [isLoading, setIsLoading] = React.useState(true)
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

  React.useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoading(true)
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError) {
          console.error('Authentication error:', authError.message)
          router.push('/login')
          return
        }

        if (!authUser) {
          console.error('No authenticated user found')
          router.push('/login')
          return
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching user:', error)
        router.push('/login')
      }
    }

    getUser()
  }, [router, supabase.auth])

  if (isLoading) {
    return <div>Loading...</div>
  }

  const navigation = {
    navMain: navigationData[user.role]?.navMain || [],
    navSecondary: navigationData.navSecondary,
    projects: navigationData.projects,
  }

  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
      <SidebarHeader>
        <NavUser user={user} onLogout={handleLogout} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation.navMain} />
        <NavSecondary items={navigation.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {navigation.projects.map((project) => (
            <SidebarMenuItem key={project.name}>
              <SidebarMenuButton asChild>
                <Link href={project.url}>
                  {project.icon && <project.icon className="mr-2 h-4 w-4" />}
                  {project.name}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
} 