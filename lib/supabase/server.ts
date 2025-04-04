'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'

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
      console.error("Supabase-Umgebungsvariablen fehlen. Weiterleitung zur Fehlerseite.");
      
      // In einer Server-Komponente können wir bei Fehlern zur Fehlerseite umleiten
      // In einer Middleware oder Server-Action sollten wir einen Fehler werfen
      try {
        redirect('/api/error?message=missing_env_vars');
      } catch (redirectError) {
        // Ignoriere den Redirect-Fehler, falls diese Funktion in einem Kontext
        // aufgerufen wird, der redirect nicht unterstützt (z.B. getStaticProps)
        console.error("Konnte nicht zur Fehlerseite umleiten", redirectError);
      }
      
      // Wenn wir diesen Punkt erreichen, was in manchen Fällen passieren kann,
      // müssen wir eine Instanz erzeugen, die zwar nicht funktioniert, aber
      // zumindest keinen Laufzeitfehler verursacht
      return createServerClient(
        'https://placeholder-url.supabase.co',
        'placeholder-key',
        {
          cookies: {
            getAll: () => [],
            setAll: () => {}
          }
        }
      )
    }
    
    return createServerClient(
      supabaseUrl,
      supabaseKey,
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