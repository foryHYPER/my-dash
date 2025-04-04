'use server'

import { revalidatePath } from 'next/cache'
// We won't use redirect directly anymore
// import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

// Definiere den Rückgabetyp für die Login-Funktion
type LoginResult = {
  success: boolean;
  error?: string;
  redirectPath?: string;
}

export async function login(formData: FormData): Promise<LoginResult> {
  try {
    console.log("Login-Prozess gestartet")
    const supabase = await createClient()

    // FormData in Objekt umwandeln
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return { 
        success: false, 
        error: "E-Mail und Passwort sind erforderlich" 
      }
    }

    console.log(`Login-Versuch für: ${email}`)

    // Authentifizierung mit E-Mail und Passwort
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    })

    if (error) {
      console.error("Login-Fehler:", error.message)
      return { 
        success: false, 
        error: error.message.includes('Invalid login credentials') 
          ? 'Ungültige E-Mail oder Passwort' 
          : error.message 
      }
    }

    if (!data.user) {
      console.error("Login erfolgreich, aber kein Benutzer vorhanden")
      return { 
        success: false, 
        error: "Benutzer konnte nicht gefunden werden" 
      }
    }

    console.log(`Erfolgreiche Anmeldung für Benutzer: ${data.user.id}`)

    // Benutzerprofil mit Rolleninformation laden
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.error("Fehler beim Laden des Profils:", profileError.message)
      return { 
        success: false, 
        error: "Fehler beim Laden des Benutzerprofils" 
      }
    }

    if (!profile) {
      console.log("Kein Profil gefunden. Erstelle ein neues Profil.")
      
      // Wenn kein Profil existiert, erstelle ein neues mit Standardrolle 'candidate'
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          role: 'candidate',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (createProfileError) {
        console.error("Fehler beim Erstellen des Profils:", createProfileError)
        // Trotz Fehler beim Erstellen des Profils fahren wir fort
      }
      
      // Setze Cookie mit der Standardrolle
      const cookieStore = await cookies()
      cookieStore.set('user-role', 'candidate', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 Woche
      })
      
      revalidatePath('/dashboard')
      return {
        success: true,
        redirectPath: '/dashboard/candidate'
      }
    }

    // Prüfe, ob die Rolle gültig ist
    if (!profile.role || !['admin', 'company', 'candidate'].includes(profile.role)) {
      console.error("Ungültige Benutzerrolle:", profile.role)
      // Wenn keine gültige Rolle, setze Standard auf 'candidate'
      profile.role = 'candidate'
    }

    // Setze Cookie mit der Rolle
    const cookieStore = await cookies()
    cookieStore.set('user-role', profile.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 Woche
    })

    console.log("Login und Profilprüfung erfolgreich. Rolle:", profile.role)
    revalidatePath('/dashboard')
    
    // Weiterleitung basierend auf der Rolle
    let redirectPath = '/dashboard'
    if (profile.role === 'company') {
      redirectPath = '/dashboard/company'
    } else if (profile.role === 'candidate') {
      redirectPath = '/dashboard/candidate'
    } else if (profile.role === 'admin') {
      redirectPath = '/dashboard/admin'
    }
    
    return {
      success: true,
      redirectPath
    }
  } catch (error: unknown) {
    console.error("Unerwarteter Fehler im Login-Prozess:", error)
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler'
    return { 
      success: false, 
      error: "Ein unerwarteter Fehler ist aufgetreten: " + errorMessage 
    }
  }
}