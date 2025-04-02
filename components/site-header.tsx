"use client"

import * as React from "react"
import { SidebarIcon } from "lucide-react"
import { usePathname } from "next/navigation"


import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"

const routeTranslations: Record<string, string> = {
  dashboard: "Dashboard",
  overview: "Übersicht",
  applications: "Bewerbungen",
  "saved-jobs": "Gespeicherte Jobs",
  profile: "Profil",
  "personal-info": "Persönliche Daten",
  skills: "Fähigkeiten",
  experience: "Erfahrung",
  education: "Ausbildung",
  "active-jobs": "Aktive Jobs",
  "post-job": "Neuen Job erstellen",
  "manage-jobs": "Jobs verwalten",
  candidates: "Kandidaten",
  company: "Unternehmen",
  team: "Team",
  settings: "Einstellungen",
  support: "Support",
  feedback: "Feedback",
  interviews: "Terminübersicht",
}

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const pathname = usePathname()
  const paths = pathname.split('/').filter(Boolean)

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            {paths.map((path, index) => {
              const translation = routeTranslations[path] || path
              const isLast = index === paths.length - 1
              const href = `/${paths.slice(0, index + 1).join('/')}`

              return (
                <React.Fragment key={path}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{translation}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href}>{translation}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>

      </div>
    </header>
  )
}
