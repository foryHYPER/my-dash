"use client"

import { Search, CheckCircle2, XCircle, Filter, SlidersHorizontal, ChevronUp, ChevronDown, User, Mail, MapPin, Clock, Award } from "lucide-react"
import { DashboardContent } from "@/components/layout/dashboard-content"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

// Mock data for candidates
const mockCandidates = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Frontend Entwickler",
    experience: "5 Jahre",
    skills: ["React", "TypeScript", "CSS"],
    status: "pending",
    location: "Berlin",
    avatar: "/avatars/sarah.jpg",
    email: "sarah.j@example.com",
    matchScore: 85
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Backend Entwickler",
    experience: "3 Jahre",
    skills: ["Node.js", "Python", "MongoDB"],
    status: "accepted",
    location: "Hamburg",
    avatar: "/avatars/michael.jpg",
    email: "m.chen@example.com",
    matchScore: 78
  },
  {
    id: 3,
    name: "Anna Schmidt",
    role: "Full Stack Entwickler",
    experience: "7 Jahre",
    skills: ["React", "Node.js", "AWS"],
    status: "rejected",
    location: "München",
    avatar: "/avatars/anna.jpg",
    email: "a.schmidt@example.com",
    matchScore: 92
  },
  {
    id: 4,
    name: "David Müller",
    role: "DevOps Engineer",
    experience: "4 Jahre",
    skills: ["Docker", "Kubernetes", "Jenkins"],
    status: "pending",
    location: "Berlin",
    avatar: "/avatars/david.jpg",
    email: "d.mueller@example.com",
    matchScore: 70
  },
  {
    id: 5,
    name: "Lisa Weber",
    role: "UI/UX Designer",
    experience: "6 Jahre",
    skills: ["Figma", "Adobe XD", "Sketch"],
    status: "accepted",
    location: "Hamburg",
    avatar: "/avatars/lisa.jpg",
    email: "l.weber@example.com",
    matchScore: 88
  },
  {
    id: 6,
    name: "Thomas Koch",
    role: "Software Engineer",
    experience: "2 Jahre",
    skills: ["Java", "Spring Boot", "PostgreSQL"],
    status: "pending",
    location: "München",
    avatar: "/avatars/thomas.jpg",
    email: "t.koch@example.com",
    matchScore: 65
  }
]

const ITEMS_PER_PAGE = 6

export default function CandidatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [selectedSkill, setSelectedSkill] = useState<string>("all")
  const [candidates, setCandidates] = useState(mockCandidates)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<string>("matchScore")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [notification, setNotification] = useState<{message: string, type: "success" | "error"} | null>(null)
  
  // Get all unique skills from candidates
  const allSkills = Array.from(new Set(candidates.flatMap(c => c.skills)))

  // Filter and sort candidates
  const filteredCandidates = candidates
    .filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.role.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = selectedStatus === "all" || candidate.status === selectedStatus
      const matchesLocation = selectedLocation === "all" || candidate.location === selectedLocation
      const matchesSkill = selectedSkill === "all" || candidate.skills.includes(selectedSkill)
      return matchesSearch && matchesStatus && matchesLocation && matchesSkill
    })
    .sort((a, b) => {
      let comparison = 0
      
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === "matchScore") {
        comparison = a.matchScore - b.matchScore
      } else if (sortBy === "experience") {
        comparison = parseInt(a.experience) - parseInt(b.experience)
      }
      
      return sortOrder === "asc" ? comparison : -comparison
    })

  // Paginate results
  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE)
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleStatusChange = (candidateId: number, newStatus: "accepted" | "rejected") => {
    setCandidates(candidates.map(candidate =>
      candidate.id === candidateId
        ? { ...candidate, status: newStatus }
        : candidate
    ))
    
    // Show notification
    const candidate = candidates.find(c => c.id === candidateId)
    setNotification({
      message: `${candidate?.name} wurde ${newStatus === "accepted" ? "angenommen" : "abgelehnt"}`,
      type: newStatus === "accepted" ? "success" : "error"
    })
    
    // Hide notification after 3 seconds
    setTimeout(() => setNotification(null), 3000)
  }

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus, selectedLocation, selectedSkill, sortBy, sortOrder])

  return (
    <DashboardContent>
      <div className="flex flex-col gap-6 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Kandidaten ({filteredCandidates.length})</h1>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Kandidaten suchen..."
                className="pl-10 w-[280px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "border-primary" : ""}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sortieren nach" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matchScore">Match-Score</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="experience">Erfahrung</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Advanced filters */}
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-wrap gap-4 p-4 bg-accent rounded-md"
          >
            <div>
              <p className="text-sm font-medium mb-1">Status</p>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Nach Status filtern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="pending">Ausstehend</SelectItem>
                  <SelectItem value="accepted">Angenommen</SelectItem>
                  <SelectItem value="rejected">Abgelehnt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Standort</p>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Nach Standort filtern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Standorte</SelectItem>
                  <SelectItem value="Berlin">Berlin</SelectItem>
                  <SelectItem value="Hamburg">Hamburg</SelectItem>
                  <SelectItem value="Munich">München</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Fähigkeiten</p>
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Nach Fähigkeit filtern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Fähigkeiten</SelectItem>
                  {allSkills.map(skill => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}

        {/* Notification */}
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-md ${
              notification.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-500" : 
              "bg-red-500/10 border border-red-500/20 text-red-500"
            }`}
          >
            {notification.message}
          </motion.div>
        )}

        {filteredCandidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] bg-accent/30 rounded-lg">
            <Filter className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium">Keine Kandidaten gefunden</h3>
            <p className="text-muted-foreground">Versuchen Sie, Ihre Filter anzupassen</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedCandidates.map((candidate) => (
              <Card 
                key={candidate.id} 
                className="overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <div className="relative">
                  {/* Match score indicator wird entfernt */}
                  
                  <div className="p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-16 w-16 border-2 border-muted">
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback>{candidate.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{candidate.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{candidate.role}</p>
                          <Badge
                            className={
                              candidate.status === "accepted" ? "bg-green-500 hover:bg-green-600 text-white" :
                              candidate.status === "pending" ? "bg-amber-500 hover:bg-amber-600 text-white" :
                              "bg-red-500 hover:bg-red-600 text-white"
                            }
                          >
                            {candidate.status === "accepted" ? "Angenommen" : 
                             candidate.status === "pending" ? "Ausstehend" : "Abgelehnt"}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{candidate.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{candidate.experience}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  candidate.matchScore >= 80 ? "bg-green-100 text-green-800" : 
                                  candidate.matchScore >= 60 ? "bg-amber-100 text-amber-800" : 
                                  "bg-red-100 text-red-800"
                                }`}>
                                  <Award className="h-3 w-3 mr-1" />
                                  {candidate.matchScore}%
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Match-Score basierend auf Jobanforderungen</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex justify-between mt-2">
                        {/* Quick actions */}
                        <div className="flex space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                                  onClick={() => handleStatusChange(candidate.id, "rejected")}
                                  disabled={candidate.status === "rejected"}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Kandidat ablehnen</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 text-green-500 border-green-200 hover:bg-green-50 hover:text-green-600"
                                  onClick={() => handleStatusChange(candidate.id, "accepted")}
                                  disabled={candidate.status === "accepted"}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Kandidat annehmen</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        
                        {/* View details */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="secondary" size="sm">
                              Details anzeigen
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Kandidatenprofil</DialogTitle>
                              <DialogDescription>Kandidateninformationen einsehen und verwalten</DialogDescription>
                            </DialogHeader>
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                  <Avatar className="h-20 w-20 border-2 border-muted">
                                    <AvatarImage src={candidate.avatar} />
                                    <AvatarFallback>{candidate.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h2 className="text-xl font-semibold">{candidate.name}</h2>
                                    <p className="text-muted-foreground">{candidate.role}</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <p>{candidate.email}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <p>{candidate.location}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <p>{candidate.experience}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Match-Score</h4>
                                  <div className="flex items-center gap-3">
                                    <div className="w-full bg-muted rounded-full h-2">
                                      <div 
                                        className={`h-2 rounded-full ${
                                          candidate.matchScore >= 80 ? "bg-green-500" : 
                                          candidate.matchScore >= 60 ? "bg-amber-500" : "bg-red-500"
                                        }`}
                                        style={{ width: `${candidate.matchScore}%` }}
                                      />
                                    </div>
                                    <span className="font-semibold">{candidate.matchScore}%</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Fähigkeiten</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {candidate.skills.map((skill) => (
                                      <Badge key={skill} variant="secondary">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Aktueller Status</h4>
                                  <Badge
                                    className={
                                      candidate.status === "accepted" ? "bg-green-500 hover:bg-green-600 text-white" :
                                      candidate.status === "pending" ? "bg-amber-500 hover:bg-amber-600 text-white" :
                                      "bg-red-500 hover:bg-red-600 text-white"
                                    }
                                  >
                                    {candidate.status === "accepted" ? "Angenommen" : 
                                     candidate.status === "pending" ? "Ausstehend" : "Abgelehnt"}
                                  </Badge>
                                </div>
                                
                                <div className="pt-4">
                                  <h4 className="text-sm font-medium mb-2">Aktionen</h4>
                                  <div className="flex flex-col space-y-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => {}}
                                      className="justify-start"
                                    >
                                      <Mail className="mr-2 h-4 w-4" />
                                      E-Mail senden
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => {}}
                                      className="justify-start"
                                    >
                                      <User className="mr-2 h-4 w-4" />
                                      Vorstellungsgespräch planen
                                    </Button>
                                  </div>
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
                                Ablehnen
                              </Button>
                              <Button
                                variant="default"
                                onClick={() => handleStatusChange(candidate.id, "accepted")}
                                className="flex items-center"
                                disabled={candidate.status === "accepted"}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Annehmen
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Zurück
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }).map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Weiter
            </Button>
          </div>
        )}
      </div>
    </DashboardContent>
  )
}
