"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Mail, Phone, MapPin, Briefcase, GraduationCap, Award } from "lucide-react"

// Mock-Daten
const mockProfile = {
  fullName: "Max Mustermann",
  email: "max.mustermann@example.com",
  phone: "+49 123 456789",
  location: "Berlin, Deutschland",
  title: "Senior Frontend Entwickler",
  bio: "Erfahrener Frontend-Entwickler mit über 5 Jahren Erfahrung in React und TypeScript. Spezialisiert auf moderne Web-Technologien und UI/UX-Design.",
  skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js", "Git"],
  experience: [
    {
      company: "TechCorp GmbH",
      position: "Senior Frontend Entwickler",
      period: "2020 - Heute",
      description: "Entwicklung und Wartung von Web-Anwendungen mit React und TypeScript."
    },
    {
      company: "WebDev Solutions",
      position: "Frontend Entwickler",
      period: "2018 - 2020",
      description: "Implementierung von UI-Komponenten und Integration von APIs."
    }
  ],
  education: [
    {
      institution: "Technische Universität Berlin",
      degree: "Bachelor of Science in Informatik",
      period: "2014 - 2018",
      description: "Schwerpunkt auf Softwareentwicklung und Webtechnologien."
    }
  ],
  certifications: [
    {
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2022"
    },
    {
      name: "React Professional Certification",
      issuer: "Meta",
      date: "2021"
    }
  ]
}

export function ProfileOverview() {
  return (
    <div className="flex flex-col gap-6 py-6">
      

      <div className="grid gap-6">
        {/* Profil-Karte */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-6">
              <Avatar className="h-32 w-32">
                <AvatarImage src="/avatar.png" alt={mockProfile.fullName} className="object-cover" />
                <AvatarFallback className="text-2xl">{mockProfile.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{mockProfile.fullName}</CardTitle>
                <CardDescription className="text-lg">{mockProfile.title}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <span>{mockProfile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-500" />
                <span>{mockProfile.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                <span>{mockProfile.location}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs für verschiedene Profilbereiche */}
        <Tabs defaultValue="about" className="space-y-4">
          <TabsList>
            <TabsTrigger value="about">Über mich</TabsTrigger>
            <TabsTrigger value="experience">Erfahrung</TabsTrigger>
            <TabsTrigger value="education">Ausbildung</TabsTrigger>
            <TabsTrigger value="certifications">Zertifizierungen</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Über mich</CardTitle>
                <CardDescription>Persönliche Beschreibung und Fähigkeiten</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>{mockProfile.bio}</p>
                  <div>
                    <h4 className="font-medium mb-2">Fähigkeiten</h4>
                    <div className="flex flex-wrap gap-2">
                      {mockProfile.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Berufserfahrung</CardTitle>
                <CardDescription>Ihre bisherigen Arbeitsstellen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockProfile.experience.map((exp, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Briefcase className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">{exp.position}</h4>
                        <p className="text-sm">{exp.company}</p>
                        <p className="text-sm">{exp.period}</p>
                        <p className="mt-2 text-sm">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ausbildung</CardTitle>
                <CardDescription>Ihre akademische Laufbahn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockProfile.education.map((edu, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <GraduationCap className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-sm">{edu.institution}</p>
                        <p className="text-sm">{edu.period}</p>
                        <p className="mt-2 text-sm">{edu.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Zertifizierungen</CardTitle>
                <CardDescription>Ihre erworbenen Zertifikate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockProfile.certifications.map((cert, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="bg-yellow-100 p-2 rounded-lg">
                        <Award className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">{cert.name}</h4>
                        <p className="text-sm">{cert.issuer}</p>
                        <p className="text-sm">{cert.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 