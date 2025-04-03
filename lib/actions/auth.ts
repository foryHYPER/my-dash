'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type AuthResult = {
  success: boolean
  error?: string
}

interface LoginData {
  email: string
  password: string
}

export async function login(data: LoginData): Promise<AuthResult> {
  try {
    const supabase = await createClient()

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        return { success: false, error: 'Ungültige E-Mail oder Passwort' }
      }
      if (authError.message.includes('Email not confirmed')) {
        return { success: false, error: 'Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse' }
      }
      throw authError
    }

    if (!authData.user) {
      return { success: false, error: 'Anmeldung fehlgeschlagen' }
    }

    // Hole das Benutzerprofil mit der Rolle
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return { success: false, error: 'Fehler beim Laden des Benutzerprofils' }
    }

    if (!profile) {
      return { success: false, error: 'Benutzerprofil nicht gefunden' }
    }

    // Setze einen Cookie für die Rolle
    const cookieStore = await cookies()
    cookieStore.set('user-role', profile.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 Woche
    })

    // Leite den Benutzer basierend auf seiner Rolle weiter
    const redirectPath = profile.role === 'admin' 
      ? '/dashboard/admin'
      : profile.role === 'company'
      ? '/dashboard/company'
      : '/dashboard/candidate'
    
    redirect(redirectPath)

    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten' 
    }
  }
} 