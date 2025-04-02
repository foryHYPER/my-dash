import { CSCSBanner } from "@/components/dashboard/cscs-banner"

interface DashboardContentProps {
  children: React.ReactNode
}

export function DashboardContent({ children }: DashboardContentProps) {
  return (
    <div className="space-y-4">
      <CSCSBanner />
      {children}
    </div>
  )
} 