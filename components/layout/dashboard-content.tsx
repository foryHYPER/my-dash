"use client"

import { CSCSBanner } from "@/components/dashboard/cscs-banner"
import { Suspense } from "react"

interface DashboardContentProps {
  children: React.ReactNode
}

// Loading fallback for the banner
function BannerSkeleton() {
  return (
    <div className="bg-gradient-to-r from-blue-200 to-purple-200 p-6 rounded-xl animate-pulse">
      <div className="h-12 w-full" />
    </div>
  )
}

export function DashboardContent({ children }: DashboardContentProps) {
  return (
    <div className="space-y-4">
      <Suspense fallback={<BannerSkeleton />}>
        <CSCSBanner />
      </Suspense>
      {children}
    </div>
  )
} 