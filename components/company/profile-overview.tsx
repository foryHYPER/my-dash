"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, MapPin, Building2, Users, Globe, Briefcase } from "lucide-react"

// Mock-Daten
const mockCompany = {
  name: "Acme Inc.",
  email: "contact@acme-inc.com",
  phone: "+49 123 456789",
  location: "Berlin, Deutschland",
  website: "www.acme-inc.com",
  industry: "Technologie",
  size: "50-200 Mitarbeiter",
  founded: "2015",
  description: "Acme Inc. ist ein führendes Technologieunternehmen, das sich auf innovative Softwarelösungen spezialisiert hat. Wir entwickeln maßgeschneiderte Lösungen für Unternehmen weltweit.",
  benefits: ["Flexible Arbeitszeiten", "Home Office", "Weiterbildungsmöglichkeiten", "Team Events"],
  activeJobs: [
    {
      title: "Senior Frontend Entwickler",
      location: "Berlin",
      type: "Vollzeit",
      applications: 24
    },
    {
      title: "Backend Engineer",
      location: "Remote",
      type: "Vollzeit",
      applications: 18
    }
  ],
  team: [
    {
      name: "Dr. Sarah Schmidt",
      role: "CTO",
      department: "Technologie"
    },
    {
      name: "Michael Weber",
      role: "Head of HR",
      department: "Personal"
    }
  ]
}

export function ProfileOverview() {
  return (


      <div className="grid gap-6">
        {/* Unternehmens-Karte */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/avatar.png" alt={mockCompany.name} />
                <AvatarFallback>{mockCompany.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{mockCompany.name}</CardTitle>
                <CardDescription>{mockCompany.industry}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{mockCompany.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{mockCompany.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{mockCompany.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>{mockCompany.website}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs für verschiedene Profilbereiche */}
        <Tabs defaultValue="about" className="space-y-4">
          <TabsList>
            <TabsTrigger value="about">Über uns</TabsTrigger>
            <TabsTrigger value="jobs">Aktive Jobs</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Über uns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{mockCompany.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>Größe: {mockCompany.size}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Gegründet: {mockCompany.founded}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Aktive Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCompany.activeJobs.map((job, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.type}</span>
                        </div>
                      </div>
                      <Badge variant="secondary">{job.applications} Bewerbungen</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Unser Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCompany.team.map((member, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Avatar>
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{member.role}</span>
                          <span>•</span>
                          <span>{member.department}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benefits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockCompany.benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
} 