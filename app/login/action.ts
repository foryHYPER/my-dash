'use server'

import { revalidatePath } from 'next/cache'
// We won't use redirect directly anymore
// import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

// Define a custom error type for better error handling
type AppError = Error | { message?: string; [key: string]: unknown }

// Define the return type for our login function
type LoginResult = {
  success: boolean;
  error?: string;
  redirectPath?: string;
}

export async function login(formData: FormData): Promise<LoginResult> {
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
        return { 
          success: false, 
          error: error.message.includes('Invalid login credentials') 
            ? 'Ungültige E-Mail oder Passwort' 
            : error.message 
        }
      }

      if (!data.user) {
        console.error("Login erfolgreich, aber kein Benutzer vorhanden");
        return { success: false, error: "Benutzer konnte nicht gefunden werden." }
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
          return { success: false, error: "Fehler beim Laden des Benutzerprofils: " + profileError.message }
        }

        if (!profile) {
          console.error("Kein Profil für Benutzer gefunden:", data.user.id);
          return { success: false, error: "Benutzerprofil konnte nicht gefunden werden." }
        }

        console.log("Profil gefunden:", JSON.stringify(profile));
        console.log("Benutzerrolle:", profile.role);

        // Überprüfe, ob die Rolle gültig ist
        if (!profile.role || !['admin', 'company', 'candidate'].includes(profile.role)) {
          console.error("Ungültige Benutzerrolle:", profile.role);
          return { success: false, error: "Ungültige Benutzerrolle im Profil." }
        }

        // Setze einen Cookie für die Rolle
        const cookieStore = await cookies()
        cookieStore.set('user-role', profile.role, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 1 Woche
        })

        console.log("Login und Profilprüfung erfolgreich, leite weiter...");
        revalidatePath('/dashboard')
        
        // Determine the correct dashboard path
        let redirectPath = '/dashboard';
        if (profile.role === 'company') {
          redirectPath = '/dashboard/company';
        } else if (profile.role === 'candidate') {
          redirectPath = '/dashboard/candidate';
        } else if (profile.role === 'admin') {
          redirectPath = '/dashboard/admin';
        }
        
        // Return success with the redirect path instead of redirecting directly
        return {
          success: true,
          redirectPath: redirectPath
        }
      } catch (profileError: unknown) {
        const err = profileError as AppError;
        console.error("Unerwarteter Fehler beim Abrufen des Profils:", err);
        return { 
          success: false, 
          error: "Unerwarteter Fehler beim Laden des Profils: " + (err.message || 'Unbekannter Fehler') 
        }
      }
    } catch (authError: unknown) {
      const err = authError as AppError;
      console.error("Unerwarteter Fehler beim Authentifizieren:", err);
      return { 
        success: false, 
        error: "Authentifizierungsfehler: " + (err.message || 'Unbekannter Fehler') 
      }
    }
  } catch (error: unknown) {
    const err = error as AppError;
    console.error("Allgemeiner Fehler im Login-Prozess:", err);
    return { 
      success: false, 
      error: "Ein unerwarteter Fehler ist aufgetreten: " + (err.message || 'Unbekannter Fehler') 
    }
  }
}