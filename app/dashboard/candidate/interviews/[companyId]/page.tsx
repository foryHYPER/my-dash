"use client"

import { Search, Calendar, Clock, Building2, Video, Phone, CheckCircle2, XCircle, ArrowLeft } from "lucide-react"
import { DashboardContent } from "@/components/layout/dashboard-content"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useState, use } from "react"
import Link from "next/link"

interface Interview {
  id: number
  date: string
  time: string
  type: 'video' | 'phone' | 'in-person'
  status: 'pending' | 'accepted' | 'suggested'
  duration: string
  location: string
  notes: string
}

type Params = Promise<{
  companyId: string
}>

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

interface PageProps {
  params: Params
  searchParams?: SearchParams
}

// Mock data for company interviews
const mockCompanyInterviews = (companyId: string) => ({
  company: {
    id: parseInt(companyId),
    name: "Acme Inc.",
    position: "Senior Frontend Developer"
  },
  interviews: [
    {
      id: 1,
      date: "2024-03-25",
      time: "10:00",
      type: "video" as const,
      status: "pending" as const,
      duration: "60 min",
      location: "Online",
      notes: "Technical interview focusing on React and TypeScript"
    },
    {
      id: 2,
      date: "2024-03-28",
      time: "14:00",
      type: "in-person" as const,
      status: "accepted" as const,
      duration: "45 min",
      location: "Office Berlin",
      notes: "Final interview with team"
    },
    {
      id: 3,
      date: "2024-03-30",
      time: "11:00",
      type: "video" as const,
      status: "suggested" as const,
      duration: "30 min",
      location: "Online",
      notes: "Initial screening interview"
    }
  ] as Interview[]
})

export default function CompanyInterviewsPage({ params, searchParams }: PageProps) {
  const resolvedParams = use(params)
  const resolvedSearchParams = searchParams ? use(searchParams) : {}
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const interviews = mockCompanyInterviews(resolvedParams.companyId).interviews
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.time.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || interview.status === selectedStatus
    const matchesType = selectedType === "all" || interview.type === selectedType
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500 hover:bg-green-600 text-white"
      case "pending":
        return "bg-orange-500 hover:bg-orange-600 text-white"
      case "suggested":
        return "bg-blue-500 hover:bg-blue-600 text-white"
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      default:
        return <Building2 className="h-4 w-4" />
    }
  }

  return (
    <DashboardContent>
      <div className="flex flex-col gap-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/candidate/interviews">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{mockCompanyInterviews(resolvedParams.companyId).company.name}</h1>
              <p className="text-sm text-muted-foreground">{mockCompanyInterviews(resolvedParams.companyId).company.position}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Termine durchsuchen..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status filtern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="accepted">Bestätigt</SelectItem>
                <SelectItem value="pending">Ausstehend</SelectItem>
                <SelectItem value="suggested">Vorgeschlagen</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Typ filtern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Typen</SelectItem>
                <SelectItem value="video">Video Call</SelectItem>
                <SelectItem value="phone">Telefon</SelectItem>
                <SelectItem value="in-person">Vor Ort</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredInterviews.map((interview) => (
            <Card 
              key={interview.id} 
              className="p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                setSelectedInterview(interview)
                setIsDetailsDialogOpen(true)
              }}
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Vorstellungsgespräch</h3>
                    <p className="text-sm text-muted-foreground">{interview.type === "video" ? "Video Call" : 
                      interview.type === "phone" ? "Telefon" : "Vor Ort"}</p>
                  </div>
                  <Badge className={getStatusColor(interview.status)}>
                    {interview.status === "accepted" ? "Bestätigt" :
                     interview.status === "pending" ? "Ausstehend" :
                     "Vorgeschlagen"}
                  </Badge>
                </div>
                
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(interview.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{interview.time} ({interview.duration})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(interview.type)}
                    <span>{interview.location}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Termin Details</DialogTitle>
            <DialogDescription>
              Details zum Vorstellungsgespräch anzeigen und verwalten
            </DialogDescription>
          </DialogHeader>
          {selectedInterview && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <h4 className="font-medium">Datum & Uhrzeit</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedInterview.date).toLocaleDateString()} um {selectedInterview.time} ({selectedInterview.duration})
                </p>
              </div>
              <div className="grid gap-2">
                <h4 className="font-medium">Typ & Ort</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedInterview.type === "video" ? "Video Call" : 
                   selectedInterview.type === "phone" ? "Telefon" : "Vor Ort"} - {selectedInterview.location}
                </p>
              </div>
              <div className="grid gap-2">
                <h4 className="font-medium">Notizen</h4>
                <p className="text-sm text-muted-foreground">{selectedInterview.notes}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Schließen
            </Button>
            {selectedInterview?.status === "suggested" && (
              <div className="flex gap-2">
                <Button variant="destructive">
                  <XCircle className="h-4 w-4 mr-2" />
                  Ablehnen
                </Button>
                <Button variant="outline">
                  Alternativ vorschlagen
                </Button>
                <Button>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Annehmen
                </Button>
              </div>
            )}
            {selectedInterview?.status === "pending" && (
              <Button variant="outline">
                Details anzeigen
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardContent>
  )
} 