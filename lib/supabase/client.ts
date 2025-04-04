import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Erstellen eines Browser-Clients für Client Components
  // Diese Funktion wird für jede Anfrage aufgerufen, aber createBrowserClient
  // verwendet intern ein Singleton-Pattern, sodass nur eine Instanz erstellt wird
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}