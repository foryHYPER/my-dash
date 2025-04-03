'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Define a custom error type for better error handling
type AppError = Error | { message?: string; [key: string]: unknown }

export async function login(formData: FormData) {
  try {
    console.log("Login action started");
    const supabase = await createClient()

    // Umwandeln von FormData in ein Objekt
    const formDataObj = Object.fromEntries(formData)
    const email = formDataObj.email as string
    const password = formDataObj.password as string

    console.log("Login-Versuch für:", email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        console.error("Login-Fehler:", error.message, error);
        redirect('/login?error=auth_' + encodeURIComponent(error.message))
      }

      if (!data.user) {
        console.error("Login erfolgreich, aber kein Benutzer vorhanden");
        redirect('/login?error=no_user')
      }

      console.log("Login erfolgreich, Benutzer:", data.user?.id);
      console.log("Session gültig:", !!data.session);

      // Hole das Benutzerprofil mit der Rolle
      try {
        console.log("Versuche Profil zu laden für Benutzer:", data.user.id);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        console.log("Profil-Abfrage abgeschlossen, Ergebnis:", !!profile, "Fehler:", !!profileError);

        if (profileError) {
          console.error("Fehler beim Abrufen des Profils:", profileError);
          redirect('/login?error=profile_' + encodeURIComponent(profileError.message))
        }

        if (!profile) {
          console.error("Kein Profil für Benutzer gefunden:", data.user.id);
          redirect('/login?error=no_profile')
        }

        console.log("Profil gefunden:", JSON.stringify(profile));
        console.log("Benutzerrolle:", profile.role);

        // Überprüfe, ob die Rolle gültig ist
        if (!profile.role || !['admin', 'company', 'candidate'].includes(profile.role)) {
          console.error("Ungültige Benutzerrolle:", profile.role);
          redirect('/login?error=invalid_role')
        }

        console.log("Login und Profilprüfung erfolgreich, leite weiter...");
        revalidatePath('/dashboard')
        
        // Unterschiedliche Weiterleitungen je nach Rolle
        if (profile.role === 'company') {
          redirect('/dashboard/company');
        } else if (profile.role === 'candidate') {
          redirect('/dashboard/candidate');
        } else if (profile.role === 'admin') {
          redirect('/dashboard/admin');
        } else {
          redirect('/dashboard');
        }
      } catch (profileError: unknown) {
        const err = profileError as AppError;
        console.error("Unerwarteter Fehler beim Abrufen des Profils:", err);
        redirect('/login?error=profile_error&message=' + encodeURIComponent(err.message || 'Unbekannter Fehler'))
      }
    } catch (authError: unknown) {
      const err = authError as AppError;
      console.error("Unerwarteter Fehler beim Authentifizieren:", err);
      redirect('/login?error=auth_error&message=' + encodeURIComponent(err.message || 'Unbekannter Fehler'))
    }
  } catch (error: unknown) {
    const err = error as AppError;
    console.error("Allgemeiner Fehler im Login-Prozess:", err);
    redirect('/login?error=unexpected_error&message=' + encodeURIComponent(err.message || 'Unbekannter Fehler'))
  }
}