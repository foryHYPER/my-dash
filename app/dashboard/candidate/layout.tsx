import { RoleGuard } from "@/components/role-guard"

export default function CandidateDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard allowedRole="candidate">
      <div className="flex flex-1 flex-col gap-4 p-4">
        {children}
      </div>
    </RoleGuard>
  )
} 