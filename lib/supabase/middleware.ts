import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Erstelle eine initiale Response, die wir später modifizieren
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Erstelle einen Supabase Client für die Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // 1. Setze die Cookies in der Request (für nachfolgende Server-Komponenten)
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // 2. Erstelle eine neue Response mit den aktualisierten Cookies
          supabaseResponse = NextResponse.next({
            request,
          })
          
          // 3. Setze die Cookies in der Response (für den Browser)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // WICHTIG: Füge keinen Code zwischen createServerClient und
  // supabase.auth.getUser() ein. Ein einfacher Fehler könnte es sehr schwer machen,
  // Probleme mit zufällig abgemeldeten Benutzern zu debuggen.

  // WICHTIG: ENTFERNE NICHT auth.getUser()
  // Dieser Aufruf ist entscheidend für die Aktualisierung der Auth-Token
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Schütze Routen, die eine Authentifizierung erfordern
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // Kein Benutzer gefunden und keine öffentliche Route -> Umleitung zur Login-Seite
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // WICHTIG: Du *musst* das supabaseResponse-Objekt zurückgeben
  // Wenn du eine neue Response mit NextResponse.next() erstellst, stelle sicher:
  // 1. Die Request wird übergeben:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Die Cookies werden kopiert:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Die myNewResponse kann nach Bedarf angepasst werden, aber vermeide
  //    Änderungen an den Cookies!
  // 4. Schließlich: return myNewResponse
  
  return supabaseResponse
}