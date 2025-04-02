"use client"

import { Search, Filter, CheckCircle2, XCircle } from "lucide-react"
import { DashboardContent } from "@/components/layout/dashboard-content"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

// Mock data for candidates
const mockCandidates = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Frontend Developer",
    experience: "5 years",
    skills: ["React", "TypeScript", "CSS"],
    status: "pending",
    location: "Berlin",
    avatar: "/avatars/sarah.jpg",
    email: "sarah.j@example.com"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Backend Developer",
    experience: "3 years",
    skills: ["Node.js", "Python", "MongoDB"],
    status: "accepted",
    location: "Hamburg",
    avatar: "/avatars/michael.jpg",
    email: "m.chen@example.com"
  },
  {
    id: 3,
    name: "Anna Schmidt",
    role: "Full Stack Developer",
    experience: "7 years",
    skills: ["React", "Node.js", "AWS"],
    status: "rejected",
    location: "Munich",
    avatar: "/avatars/anna.jpg",
    email: "a.schmidt@example.com"
  },
  {
    id: 4,
    name: "David Mueller",
    role: "DevOps Engineer",
    experience: "4 years",
    skills: ["Docker", "Kubernetes", "Jenkins"],
    status: "pending",
    location: "Berlin",
    avatar: "/avatars/david.jpg",
    email: "d.mueller@example.com"
  },
  {
    id: 5,
    name: "Lisa Weber",
    role: "UI/UX Designer",
    experience: "6 years",
    skills: ["Figma", "Adobe XD", "Sketch"],
    status: "accepted",
    location: "Hamburg",
    avatar: "/avatars/lisa.jpg",
    email: "l.weber@example.com"
  },
  {
    id: 6,
    name: "Thomas Koch",
    role: "Software Engineer",
    experience: "2 years",
    skills: ["Java", "Spring Boot", "PostgreSQL"],
    status: "pending",
    location: "Munich",
    avatar: "/avatars/thomas.jpg",
    email: "t.koch@example.com"
  }
]

export default function CandidatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [candidates, setCandidates] = useState(mockCandidates)

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || candidate.status === selectedStatus
    const matchesLocation = selectedLocation === "all" || candidate.location === selectedLocation
    return matchesSearch && matchesStatus && matchesLocation
  })

  const handleStatusChange = (candidateId: number, newStatus: "accepted" | "rejected") => {
    setCandidates(candidates.map(candidate =>
      candidate.id === candidateId
        ? { ...candidate, status: newStatus }
        : candidate
    ))
  }

  return (
    <DashboardContent>
      <div className="flex flex-col gap-6 py-6">
        <div className="flex justify-end">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                <SelectItem value="Berlin">Berlin</SelectItem>
                <SelectItem value="Hamburg">Hamburg</SelectItem>
                <SelectItem value="Munich">Munich</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCandidates.map((candidate) => (
            <Dialog key={candidate.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer p-6 hover:bg-accent/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={candidate.avatar} />
                        <AvatarFallback>{candidate.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{candidate.name}</h3>
                        <p className="text-sm text-muted-foreground">{candidate.role}</p>
                        <div className="mt-2">
                          <Badge
                            className={
                              candidate.status === "accepted" ? "bg-green-500 hover:bg-green-600 text-white flex justify-center px-3 py-1.5" :
                              candidate.status === "pending" ? "bg-orange-500 hover:bg-orange-600 text-white flex justify-center px-3 py-1.5" :
                              "bg-red-500 hover:bg-red-600 text-white flex justify-center px-3 py-1.5"
                            }
                          >
                            {candidate.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{candidate.location}</div>
                  </div>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Candidate Details</DialogTitle>
                  <DialogDescription>Review and manage candidate application</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={candidate.avatar} />
                      <AvatarFallback>{candidate.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold">{candidate.name}</h2>
                      <p className="text-muted-foreground">{candidate.role}</p>
                      <p className="text-sm text-muted-foreground">{candidate.email}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">Experience</h4>
                    <p>{candidate.experience}</p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusChange(candidate.id, "rejected")}
                    className="flex items-center"
                    disabled={candidate.status === "rejected"}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handleStatusChange(candidate.id, "accepted")}
                    className="flex items-center"
                    disabled={candidate.status === "accepted"}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </DashboardContent>
  )
}
