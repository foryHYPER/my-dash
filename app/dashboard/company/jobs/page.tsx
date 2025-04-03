"use client"

import { Search, Edit2, Trash2, Building2, Clock, Euro, MapPin } from "lucide-react"
import { DashboardContent } from "@/components/layout/dashboard-content"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

// Mock data for jobs
const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    type: "Full-time",
    location: "Berlin",
    salary: "65.000€ - 85.000€",
    status: "active",
    applications: 12,
    description: "We are looking for an experienced Frontend Developer to join our team and help build amazing user experiences.",
    requirements: [
      "5+ years of experience with React",
      "Strong TypeScript skills",
      "Experience with state management",
      "Understanding of modern CSS practices"
    ],
    postedAt: "2024-02-15"
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    type: "Full-time",
    location: "Hamburg",
    salary: "60.000€ - 80.000€",
    status: "draft",
    applications: 0,
    description: "Join our product team to help shape the future of our platform.",
    requirements: [
      "3+ years of product management experience",
      "Strong analytical skills",
      "Experience with agile methodologies",
      "Excellent communication skills"
    ],
    postedAt: "2024-02-10"
  },
  {
    id: 3,
    title: "DevOps Engineer",
    department: "Infrastructure",
    type: "Full-time",
    location: "Munich",
    salary: "70.000€ - 90.000€",
    status: "active",
    applications: 8,
    description: "Help us build and maintain our cloud infrastructure and deployment pipelines.",
    requirements: [
      "Experience with AWS or GCP",
      "Knowledge of Docker and Kubernetes",
      "Understanding of CI/CD principles",
      "Infrastructure as Code experience"
    ],
    postedAt: "2024-02-01"
  }
]

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [jobs, setJobs] = useState(mockJobs)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateJob = () => {
    try {
      const newJob = {
        id: jobs.length + 1,
        title: "New Job",
        department: "Engineering",
        type: "Full-time",
        location: "Berlin",
        salary: "60.000€ - 80.000€",
        status: "draft",
        applications: 0,
        description: "",
        requirements: [],
        postedAt: new Date().toISOString().split('T')[0]
      }
      setJobs([...jobs, newJob])
      setIsCreateDialogOpen(false)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job")
    }
  }

  const handleDeleteJob = (id: number) => {
    try {
      setJobs(jobs.filter(job => job.id !== id))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete job")
    }
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || job.status === selectedStatus
    const matchesLocation = selectedLocation === "all" || job.location === selectedLocation
    return matchesSearch && matchesStatus && matchesLocation
  })

  return (
    <DashboardContent>
      <div className="flex flex-col gap-6 py-6">
        <div className="flex justify-end">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
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
          {filteredJobs.map((job) => (
            <Card key={job.id} className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.department}</p>
                  </div>
                  <Badge
                    className={
                      job.status === "active" ? "bg-green-500 hover:bg-green-600 text-white flex justify-center px-3 py-1.5" :
                      "bg-orange-500 hover:bg-orange-600 text-white flex justify-center px-3 py-1.5"
                    }
                  >
                    {job.status}
                  </Badge>
                </div>
                
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium">
                    {job.applications} applications
                  </span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteJob(job.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <DialogHeader>
            <DialogTitle>Create New Job Posting</DialogTitle>
            <DialogDescription>
              Fill in the details for your new job posting. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input placeholder="Job Title" />
            </div>
            <div className="grid gap-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Input placeholder="Location" />
            </div>
            <div className="grid gap-2">
              <Input placeholder="Salary Range" />
            </div>
            <div className="grid gap-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateJob}>
              Create Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardContent>
  )
} 