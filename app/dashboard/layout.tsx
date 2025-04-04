// Server Component (keine 'use client' Direktive)
import { requireAuth, getProfile } from "@/lib/supabase/auth"
import DashboardClient from "./dashboard-client"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Überprüfe, ob der Benutzer authentifiziert ist
  // Dies leitet automatisch zur Login-Seite weiter, wenn nicht authentifiziert
  const user = await requireAuth()
  
  // Hole das Benutzerprofil mit der Rolle
  const profile = await getProfile()
  
  // Standardrolle, falls kein Profil oder keine Rolle gefunden wurde
  const defaultRole = 'candidate' as const
  
  // Übergebe alle Daten an die Client-Komponente
  return (
    <DashboardClient 
      user={{
        name: user.email || '',
        email: user.email || '',
        avatar: '',
        role: profile?.role || defaultRole
      }}
    >
      {children}
    </DashboardClient>
  )
} 