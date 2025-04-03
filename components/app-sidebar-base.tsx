"use client"

import * as React from "react"
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
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"


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




interface AppSidebarProps {
  user: {
    name: string
    email: string
    avatar: string
    role: "candidate" | "company"
  }
}

export function AppSidebar({ user: initialUser, ...props }: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState(initialUser)
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

        // Fetch additional user data from your profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (profileError) {
          console.error('Error fetching profile:', profileError.message)
          return
        }

        if (!profile) {
          console.error('No profile found for user')
          return
        }

        setUser({
          name: profile.name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
          email: authUser.email || '',
          avatar: profile.avatar_url || authUser.user_metadata?.avatar_url || '',
          role: profile.role || 'candidate',
        })
      } catch (error) {
        console.error('Error in getUser:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    getUser()
  }, [router])

  if (isLoading) {
    return null // or a loading spinner
  }

  const data = {
    ...navigationData,
    navMain: navigationData[user.role].navMain,
  }



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
                <div className="flex items-center justify-center p-2">
                  <img src="/logo.png" alt="RE-24 Jobs" className="h-14 w-auto" />
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <div className="px-4 py-2">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          
            
          </div>
        </div>
        <NavMain items={data.navMain} />
   
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} onLogout={handleLogout} />
      </SidebarFooter>
    </Sidebar>
  )
} 