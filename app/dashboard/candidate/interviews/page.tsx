"use client"

import { Search, Building2, Calendar } from "lucide-react"
import { DashboardContent } from "@/components/layout/dashboard-content"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState } from "react"

// Mock data for companies with interview suggestions
const mockCompanies = [
  {
    id: 1,
    name: "Acme Inc.",
    position: "Senior Frontend Developer",
    pendingInterviews: 2,
    totalInterviews: 3
  },
  {
    id: 2,
    name: "TechCorp GmbH",
    position: "Full Stack Developer",
    pendingInterviews: 1,
    totalInterviews: 2
  },
  {
    id: 3,
    name: "StartUpX",
    position: "Backend Developer",
    pendingInterviews: 0,
    totalInterviews: 1
  }
]

export default function InterviewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const filteredCompanies = mockCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || 
      (selectedStatus === "pending" && company.pendingInterviews > 0)
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardContent>
      <div className="flex flex-col gap-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Terminübersicht</h1>
            <p className="text-sm text-muted-foreground">
              Übersicht aller Unternehmen mit Terminvorschlägen
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Unternehmen durchsuchen..."
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
                <SelectItem value="all">Alle Unternehmen</SelectItem>
                <SelectItem value="pending">Mit ausstehenden Terminen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredCompanies.map((company) => (
            <Link href={`/dashboard/candidate/interviews/${company.id}`} key={company.id}>
              <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{company.name}</h3>
                      <p className="text-sm text-muted-foreground">{company.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{company.totalInterviews} Termine</span>
                    </div>
                    {company.pendingInterviews > 0 && (
                      <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-sm">
                        {company.pendingInterviews} ausstehend
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DashboardContent>
  )
} 