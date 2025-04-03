"use client"

import { Search, Calendar, Clock, Building2, Video, Phone, CheckCircle2, XCircle } from "lucide-react"
import { DashboardContent } from "@/components/layout/dashboard-content"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface Appointment {
  id: number
  candidateName: string
  position: string
  date: string
  time: string
  type: 'video' | 'phone' | 'in-person'
  status: 'confirmed' | 'pending' | 'cancelled'
  duration: string
  location: string
  notes: string
}

// Mock data for appointments
const mockAppointments: Appointment[] = [
  {
    id: 1,
    candidateName: "Max Mustermann",
    position: "Senior Frontend Developer",
    date: "2024-03-20",
    time: "14:00",
    type: "video",
    status: "confirmed",
    duration: "60 min",
    location: "Online",
    notes: "Technical interview focusing on React and TypeScript"
  },
  {
    id: 2,
    candidateName: "Anna Schmidt",
    position: "Product Manager",
    date: "2024-03-21",
    time: "10:00",
    type: "in-person",
    status: "pending",
    duration: "45 min",
    location: "Office Berlin",
    notes: "Final interview with team"
  },
  {
    id: 3,
    candidateName: "Tom Weber",
    position: "DevOps Engineer",
    date: "2024-03-22",
    time: "15:30",
    type: "phone",
    status: "confirmed",
    duration: "30 min",
    location: "Phone Call",
    notes: "Initial screening interview"
  }
]

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const appointments = mockAppointments
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || appointment.status === selectedStatus
    const matchesType = selectedType === "all" || appointment.type === selectedType
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500 hover:bg-green-600 text-white"
      case "pending":
        return "bg-orange-500 hover:bg-orange-600 text-white"
      case "cancelled":
        return "bg-red-500 hover:bg-red-600 text-white"
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
        <div className="flex justify-end">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="video">Video Call</SelectItem>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="in-person">In Person</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAppointments.map((appointment) => (
            <Card 
              key={appointment.id} 
              className="p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                setSelectedAppointment(appointment)
                setIsDetailsDialogOpen(true)
              }}
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{appointment.candidateName}</h3>
                    <p className="text-sm text-muted-foreground">{appointment.position}</p>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
                
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{appointment.time} ({appointment.duration})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(appointment.type)}
                    <span>{appointment.location}</span>
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
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              View and manage appointment details
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <h4 className="font-medium">Candidate</h4>
                <p className="text-sm text-muted-foreground">{selectedAppointment.candidateName}</p>
              </div>
              <div className="grid gap-2">
                <h4 className="font-medium">Position</h4>
                <p className="text-sm text-muted-foreground">{selectedAppointment.position}</p>
              </div>
              <div className="grid gap-2">
                <h4 className="font-medium">Date & Time</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.time} ({selectedAppointment.duration})
                </p>
              </div>
              <div className="grid gap-2">
                <h4 className="font-medium">Type & Location</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedAppointment.type === "video" ? "Video Call" : 
                   selectedAppointment.type === "phone" ? "Phone Call" : "In Person"} - {selectedAppointment.location}
                </p>
              </div>
              <div className="grid gap-2">
                <h4 className="font-medium">Notes</h4>
                <p className="text-sm text-muted-foreground">{selectedAppointment.notes}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Appointment
              </Button>
              <Button>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardContent>
  )
} 