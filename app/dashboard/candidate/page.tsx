"use client"

import { 
  FileText,  
  CheckCircle2, 
  Star, 
  User 
} from "lucide-react"
import { KPICard } from "@/components/dashboard/kpi-card"
import { DashboardContent } from "@/components/layout/dashboard-content"
import { Suspense } from "react"

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-64 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}

function CandidateDashboardContent() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Gesendete Bewerbungen"
          value={8}
          description="Aktive Bewerbungen"
          icon={FileText}
          trend={{ value: 3, isPositive: true }}
        />
        <KPICard
          title="Profilaufrufe"
          value={45}
          description="Von Unternehmen diesen Monat"
          icon={User}
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Rücklaufquote"
          value="75%"
          description="Von Unternehmen"
          icon={CheckCircle2}
          trend={{ value: 5, isPositive: true }}
        />
        <KPICard
          title="Profilwertung"
          value="92%"
          description="Vollständigkeit"
          icon={Star}
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-card rounded-xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">Status der Bewerbungen</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Senior Frontend Entwickler</p>
                <p className="text-sm text-muted-foreground">Acme GmbH</p>
              </div>
              <span className="text-sm text-green-500">Interview geplant</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Backend Entwickler</p>
                <p className="text-sm text-muted-foreground">Tech Corp</p>
              </div>
              <span className="text-sm text-blue-500">In Prüfung</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">Kommende Interviews</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Technisches Interview</p>
                <p className="text-sm text-muted-foreground">Acme GmbH</p>
              </div>
              <span className="text-sm text-muted-foreground">Morgen, 10:00 Uhr</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">HR Interview</p>
                <p className="text-sm text-muted-foreground">Tech Corp</p>
              </div>
              <span className="text-sm text-muted-foreground">Nächste Woche, 14:00 Uhr</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function CandidateDashboard() {
  return (
    <DashboardContent>
      <Suspense fallback={<DashboardSkeleton />}>
        <CandidateDashboardContent />
      </Suspense>
    </DashboardContent>
  )
} 