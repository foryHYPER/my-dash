import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Definiere öffentliche Routen
const publicRoutes = ['/login', '/auth', '/register']
const isPublicRoute = (path: string) => publicRoutes.some(route => path.startsWith(route))

// Debugging-Hilfsfunktion
function logDebug(message: string, ...args: any[]) {
  console.log(`[Middleware] ${message}`, ...args)
}

export async function middleware(request: NextRequest) {
  try {
    // Statische Ressourcen und API-Routen überspringen
    if (
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname.startsWith('/static') ||
      request.nextUrl.pathname.includes('.')
    ) {
      return NextResponse.next()
    }

    const currentPath = request.nextUrl.pathname
    logDebug(`Verarbeite Anfrage für Pfad: ${currentPath}`)

    // Response erstellen
    const response = NextResponse.next()

    // Supabase Client erstellen
    let supabase
    try {
      logDebug('Erstelle Supabase-Client')
      supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name) {
              return request.cookies.get(name)?.value
            },
            set(name, value, options) {
              response.cookies.set({
                name,
                value,
                ...options,
              })
            },
            remove(name, options) {
              response.cookies.set({
                name,
                value: '',
                ...options,
              })
            },
          },
        }
      )
    } catch (error) {
      console.error('Fehler beim Erstellen des Supabase-Clients:', error)
      // Bei Fehlern in öffentlichen Routen weiterleiten
      if (!isPublicRoute(currentPath)) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      return NextResponse.next()
    }

    // Session überprüfen
    try {
      logDebug('Überprüfe Session')
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        throw error
      }

      // Wenn auf einer öffentlichen Route und eingeloggt, zum Dashboard weiterleiten
      if (session && isPublicRoute(currentPath)) {
        logDebug('Benutzer ist eingeloggt und auf öffentlicher Route - leite zu /dashboard weiter')
        const redirectUrl = new URL('/dashboard', request.url)
        return NextResponse.redirect(redirectUrl)
      }

      // Wenn nicht auf einer öffentlichen Route und nicht eingeloggt, zum Login weiterleiten
      if (!session && !isPublicRoute(currentPath)) {
        logDebug('Benutzer ist nicht eingeloggt und versucht auf geschützte Route zuzugreifen')
        const redirectUrl = new URL('/login', request.url)
        redirectUrl.searchParams.set('returnTo', currentPath)
        return NextResponse.redirect(redirectUrl)
      }

      logDebug('Middleware-Check abgeschlossen, fahre fort')
      return response
    } catch (sessionError) {
      console.error('Fehler beim Überprüfen der Session:', sessionError)
      // Bei Session-Fehlern in geschützten Routen zum Login umleiten
      if (!isPublicRoute(currentPath)) {
        logDebug('Fehler bei der Session-Überprüfung, leite zu /login weiter')
        const redirectUrl = new URL('/login', request.url)
        return NextResponse.redirect(redirectUrl)
      }
      return NextResponse.next()
    }

  } catch (error) {
    console.error('Allgemeiner Middleware-Fehler:', error)
    // Bei einem allgemeinen Fehler zur Login-Seite umleiten, aber nur wenn nicht bereits auf einer öffentlichen Route
    if (!isPublicRoute(request.nextUrl.pathname)) {
      const redirectUrl = new URL('/login', request.url)
      return NextResponse.redirect(redirectUrl)
    }
    return NextResponse.next()
  }
}

// Konfiguriere auf welchen Pfaden die Middleware ausgeführt werden soll
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}