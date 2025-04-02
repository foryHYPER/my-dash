import { ProfileOverview } from "@/components/company/profile-overview"
import Content from "@/components/layout/context"
import { DashboardContent } from "@/components/layout/dashboard-content"

export default function ProfilePage() {
  return (
    <DashboardContent>
      <ProfileOverview />
      <Content />
    </DashboardContent>
  )
} 