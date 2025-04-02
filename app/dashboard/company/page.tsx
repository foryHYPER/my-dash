import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Building2 
} from "lucide-react"
import { KPICard } from "@/components/dashboard/kpi-card"
import { DashboardContent } from "@/components/layout/dashboard-content"

export default function CompanyDashboard() {
  return (
    <DashboardContent>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Job Listings"
          value={12}
          description="Open positions"
          icon={Briefcase}
          trend={{ value: 8, isPositive: true }}
        />
        <KPICard
          title="Total Candidates"
          value={245}
          description="Across all positions"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Average Response Time"
          value="2.4 days"
          description="To candidate applications"
          icon={Clock}
          trend={{ value: 15, isPositive: false }}
        />
        <KPICard
          title="Interview Success Rate"
          value="68%"
          description="Of conducted interviews"
          icon={CheckCircle2}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-card rounded-xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">Recent Applications</h2>
          <div className="space-y-4">
            {/* Placeholder for applications list */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Senior Frontend Developer</p>
                <p className="text-sm text-muted-foreground">John Doe</p>
              </div>
              <span className="text-sm text-muted-foreground">2 days ago</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Backend Engineer</p>
                <p className="text-sm text-muted-foreground">Jane Smith</p>
              </div>
              <span className="text-sm text-muted-foreground">3 days ago</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">Upcoming Interviews</h2>
          <div className="space-y-4">
            {/* Placeholder for interviews list */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Technical Interview</p>
                <p className="text-sm text-muted-foreground">Alex Johnson</p>
              </div>
              <span className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">HR Interview</p>
                <p className="text-sm text-muted-foreground">Sarah Wilson</p>
              </div>
              <span className="text-sm text-muted-foreground">Tomorrow, 2:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardContent>
  )
} 