import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Die `setAll`-Methode wurde aus einer Server-Komponente aufgerufen.
            // Dies kann ignoriert werden, wenn Middleware für die Aktualisierung
            // von Benutzersitzungen verwendet wird.
            console.log('Warnung: Cookies konnten nicht aus einer Server-Komponente gesetzt werden.')
          }
        },
      },
    }
  )
}