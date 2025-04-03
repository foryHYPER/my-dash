import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  try {
    const supabase = await createClient()
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error("Fehler beim Abrufen des Benutzers:", userError.message)
        redirect("/login?error=auth_" + encodeURIComponent(userError.message))
      }
      
      if (!user) {
        console.error("Kein Benutzer gefunden")
        redirect("/login?error=no_user")
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error("Fehler beim Abrufen des Profils:", profileError.message)
          redirect("/login?error=profile_" + encodeURIComponent(profileError.message))
        }

        if (!profile) {
          console.error("Kein Profil für Benutzer gefunden:", user.id)
          redirect("/login?error=no_profile")
        }

        if (!profile.role) {
          console.error("Keine Rolle im Profil definiert für Benutzer:", user.id)
          redirect("/login?error=no_role")
        }

        console.log("Benutzerrolle:", profile.role)
        redirect(profile.role === 'company' ? '/dashboard/company' : '/dashboard/candidate')
      } catch (profileError) {
        console.error("Unerwarteter Fehler beim Abrufen des Profils:", profileError)
        redirect("/login?error=unexpected_profile_error")
      }
    } catch (userError) {
      console.error("Unerwarteter Fehler beim Abrufen des Benutzers:", userError)
      redirect("/login?error=unexpected_user_error")
    }
  } catch (error) {
    console.error("Allgemeiner Fehler in der Dashboard-Seite:", error)
    redirect("/login?error=dashboard_error")
  }
} 