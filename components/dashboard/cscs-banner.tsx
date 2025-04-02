"use client"

import { CheckCircle2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CSCSBanner() {
  const pathname = usePathname()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  
  const getBannerContent = () => {
    switch (pathname) {
      case "/dashboard/company/profile":
        return {
          title: "Dein Profil",
          description: "Vervollständige dein Profil, um mehr Kandidaten zu finden.",
          buttonText: "Profil bearbeiten"
        }
      case "/dashboard/candidate":
        return {
          title: "Dein Profil",
          description: "Vervollständige dein Profil, um deine Chancen zu erhöhen.",
          buttonText: "Profil bearbeiten"
        }

        case "/dashboard/candidate/interviews":
        return {
          title: "Deine Termine",
          description: "Hier kannst du deine Termine sehen und verwalten.",
          buttonText: "Termin erstellen"
        }

        case "/dashboard/candidate/profile":
          return {
            title: "Dein Profil",
            description: "Vervollständige dein Profil, um deine Chancen zu erhöhen.",
            buttonText: "Profil bearbeiten"
          }

      case "/dashboard/company":
        return {
          title: "Dashboard",
          description: "Willkommen in Ihrem Dashboard, starten Sie heute.",
          buttonText: "Kandidaten finden"
        }
      case "/dashboard/company/candidates":
        return {
          title: "Kandidatenübersicht",
          description: "Hier können Sie Kandidaten finden und verwalten.",
          buttonText: "Übersicht"
        }
      case "/dashboard/company/jobs":
        return {
          title: "Stellenangebote verwalten",
          description: "Erstellen Sie neue Stellenangebote oder verwalten Sie bestehende.",
          buttonText: "Job erstellen",
          action: () => setIsCreateDialogOpen(true)
        }

        case "/dashboard/company/appointments":
        return {
          title: "Termine verwalten",
          description: "Erstellen Sie neue Termine oder verwalten Sie bestehende.",
          buttonText: "Termin erstellen",
          action: () => setIsCreateDialogOpen(true)
        }
      default:
        return {
          title: "Welcome",
          description: "Welcome to your dashboard, get started today.",
          buttonText: "Get started"
        }
    }
  }

  const content = getBannerContent()

  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-950 dark:to-purple-950 text-white p-6 rounded-xl flex items-center justify-between transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium">{content.title}</h3>
            <p className="text-sm text-white/80">{content.description}</p>
          </div>
        </div>
        <button 
          onClick={content.action} 
          className="bg-white hover:bg-white/90 text-gray-900 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md active:scale-95"
        >
          {content.buttonText}
        </button>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
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
            <Button onClick={() => setIsCreateDialogOpen(false)}>
              Create Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 