import { RoleGuard } from "@/components/role-guard"
import { DashboardContent } from "@/components/layout/dashboard-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Calendar,
  Building2,
  Briefcase
} from "lucide-react"

interface BaseApplication {
  id: number
  position: string
  company: string
  date: string
  type: string
  location: string
  salary: string
}

interface ApplicationWithStatus extends BaseApplication {
  status: string
  interviewDate?: string
}

interface ApplicationWithInterview extends BaseApplication {
  status: string
  interviewDate: string
}

interface ApplicationWithRejection extends BaseApplication {
  status: string
}

type Application = BaseApplication | ApplicationWithStatus | ApplicationWithInterview | ApplicationWithRejection

// Mock-Daten für die Kanban-Ansicht
const applications: Record<string, Application[]> = {
  neu: [
    {
      id: 1,
      position: "Senior Frontend Entwickler",
      company: "Acme GmbH",
      date: "Heute",
      type: "Direkte Bewerbung",
      location: "Berlin",
      salary: "65.000€ - 85.000€",
    },
    {
      id: 2,
      position: "Backend Entwickler",
      company: "Tech Corp",
      date: "Gestern",
      type: "LinkedIn",
      location: "Hamburg",
      salary: "60.000€ - 80.000€",
    },
  ],
  inBearbeitung: [
    {
      id: 3,
      position: "Full Stack Entwickler",
      company: "Digital Solutions",
      date: "Vor 2 Tagen",
      type: "Direkte Bewerbung",
      location: "München",
      salary: "70.000€ - 90.000€",
      status: "Interview geplant",
      interviewDate: "Morgen, 14:00 Uhr",
    },
  ],
  interview: [
    {
      id: 4,
      position: "Frontend Entwickler",
      company: "WebTech AG",
      date: "Vor 3 Tagen",
      type: "Direkte Bewerbung",
      location: "Frankfurt",
      salary: "55.000€ - 75.000€",
      status: "Technisches Interview",
      interviewDate: "Nächste Woche, 10:00 Uhr",
    },
  ],
  abgeschlossen: [
    {
      id: 5,
      position: "UI/UX Designer",
      company: "Design Studio",
      date: "Vor 1 Woche",
      type: "LinkedIn",
      location: "Köln",
      salary: "50.000€ - 70.000€",
      status: "Abgelehnt",
    },
  ],
}

const columns = [
  {
    id: "neu",
    title: "Neu",
    icon: FileText,
    color: "text-blue-500",
  },
  {
    id: "inBearbeitung",
    title: "In Bearbeitung",
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    id: "interview",
    title: "Interview",
    icon: Calendar,
    color: "text-purple-500",
  },
  {
    id: "abgeschlossen",
    title: "Abgeschlossen",
    icon: CheckCircle2,
    color: "text-green-500",
  },
]

export default function ApplicationsKanbanPage() {
  return (
    <RoleGuard allowedRole="candidate">
      <DashboardContent>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <Card key={column.id} className="min-w-[300px] flex-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <column.icon className={`h-4 w-4 ${column.color}`} />
                    {column.title}
                  </div>
                </CardTitle>
                <Badge variant="secondary">
                  {applications[column.id as keyof typeof applications].length}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications[column.id as keyof typeof applications].map((application) => (
                    <Card key={application.id} className="cursor-pointer hover:bg-accent">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{application.position}</p>
                              <p className="text-sm text-muted-foreground">{application.company}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {application.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {application.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {application.salary}
                            </div>
                          </div>
                          {'status' in application && (
                            <div className="flex items-center gap-2 text-sm">
                              {application.status === "Abgelehnt" ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              )}
                              <span>{application.status}</span>
                            </div>
                          )}
                          {'interviewDate' in application && application.interviewDate && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {application.interviewDate}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardContent>
    </RoleGuard>
  )
} 