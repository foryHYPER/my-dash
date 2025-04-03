'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  try {
    const supabase = await createClient()

    // Umwandeln von FormData in ein Objekt
    const formDataObj = Object.fromEntries(formData)
    const email = formDataObj.email as string
    const password = formDataObj.password as string

    console.log("Login-Versuch für:", email);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      console.error("Login-Fehler:", error.message);
      redirect('/login?error=' + encodeURIComponent(error.message))
    }

    if (!data.user) {
      console.error("Login erfolgreich, aber kein Benutzer vorhanden");
      redirect('/login?error=no_user')
    }

    console.log("Login erfolgreich, Benutzer:", data.user?.id);
    console.log("Session gültig:", !!data.session);

    // Hole das Benutzerprofil mit der Rolle
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        console.error("Fehler beim Abrufen des Profils:", profileError.message);
        redirect('/login?error=profile_' + encodeURIComponent(profileError.message))
      }

      if (!profile) {
        console.error("Kein Profil für Benutzer gefunden:", data.user.id);
        redirect('/login?error=no_profile')
      }

      console.log("Profil gefunden:", profile);
      console.log("Benutzerrolle:", profile.role);

      // Überprüfe, ob die Rolle gültig ist
      if (!profile.role || !['admin', 'company', 'candidate'].includes(profile.role)) {
        console.error("Ungültige Benutzerrolle:", profile.role);
        redirect('/login?error=invalid_role')
      }

      revalidatePath('/dashboard')
      redirect('/dashboard')
    } catch (profileError) {
      console.error("Unerwarteter Fehler beim Abrufen des Profils:", profileError);
      redirect('/login?error=unexpected_profile_error')
    }
  } catch (error) {
    console.error("Unerwarteter Fehler beim Login:", error);
    redirect('/login?error=unexpected_error')
  }
}