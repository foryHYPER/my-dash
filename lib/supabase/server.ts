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
      // Versuche direkten Zugriff auf .env Werte als Fallback (nur für Entwicklung)
      const fallbackUrl = "https://uzthbqcqitljcymiohwe.supabase.co";
      const fallbackKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dGhicWNxaXRsamN5bWlvaHdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNzk2MzYsImV4cCI6MjA1ODg1NTYzNn0.y_EzraG-VTirim57R1Qbo_jLdWAWHoNwucoy7Oxy4E8";
      
      console.log("Verwende Fallback-Werte für Supabase-Verbindung");
      
      return createServerClient(
        fallbackUrl,
        fallbackKey,
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