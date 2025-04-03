'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function createClient() {
  try {
    // cookies() muss asynchron verwendet werden in Next.js 15
    const cookieStore = await cookies()
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase Umgebungsvariablen sind nicht konfiguriert')
    }
    
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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