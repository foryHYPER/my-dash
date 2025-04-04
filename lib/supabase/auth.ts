import { createClient } from './server'
import { redirect } from 'next/navigation'
import { type Role } from './profiles'

/**
 * Prüft, ob ein Benutzer authentifiziert ist
 * Verwendet getUser(), was einen Serveraufruf zur Validierung des Tokens macht
 * Leitet zur Login-Seite um, wenn nicht authentifiziert
 */
export async function requireAuth() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}

/**
 * Holt das Benutzerprofil mit der Rolle aus der Datenbank
 */
export async function getProfile() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return profile
}

/**
 * Prüft, ob ein Benutzer eine bestimmte Rolle hat
 * Leitet zur Login-Seite um, wenn nicht authentifiziert
 * Leitet zur Zugriffsverweigert-Seite um, wenn die Rolle nicht übereinstimmt
 */
export async function requireRole(requiredRole: Role | Role[]) {
  const user = await requireAuth()
  const profile = await getProfile()
  
  if (!profile) {
    redirect('/login')
  }
  
  const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  
  if (!profile.role || !requiredRoles.includes(profile.role)) {
    redirect('/access-denied')
  }
  
  return { user, profile }
}

/**
 * Meldet den Benutzer ab und leitet zur Login-Seite weiter
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
} 