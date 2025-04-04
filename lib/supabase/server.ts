'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function createClient() {
  try {
    // cookies() muss asynchron verwendet werden in Next.js 15
    const cookieStore = await cookies()
    
    // Debug-Ausgabe für Umgebungsvariablen
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log("Environment Vars Check:");
    console.log("- NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "Vorhanden" : "Fehlt");
    console.log("- NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseKey ? "Vorhanden" : "Fehlt");
    
    // Prüfen der Umgebungsvariablen
    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase-Umgebungsvariablen fehlen. Die Anwendung verwendet Standard-Konfiguration.");
      // Anstatt einen Fehler zu werfen, leiten wir zum Login weiter, oder zu einer Seite, die den Fehler erklärt
      // Hier könnten wir z.B. eine spezielle Fehlerseite rendern
      // In der Produktion müssen die Umgebungsvariablen richtig konfiguriert sein
    }
    
    return createServerClient(
      supabaseUrl || '',
      supabaseKey || '',
      {
        cookies: {
          getAll: () => {
            try {
              return cookieStore.getAll().map(cookie => ({
                name: cookie.name,
                value: cookie.value,
              }))
            } catch (error) {
              console.error('Fehler beim Abrufen von Cookies:', error)
              return []
            }
          },
          setAll: (cookies) => {
            try {
              cookies.forEach(cookie => cookieStore.set(cookie.name, cookie.value, cookie.options))
            } catch (error) {
              console.error('Fehler beim Setzen von Cookies:', error)
            }
          }
        }
      }
    )
  } catch (error) {
    console.error('Fehler beim Erstellen des Supabase-Clients:', error)
    throw error
  }
}