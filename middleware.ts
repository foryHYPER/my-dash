import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Definiere öffentliche Routen
const publicRoutes = ['/login', '/auth', '/register']
const isPublicRoute = (path: string) => publicRoutes.some(route => path.startsWith(route))

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

    // Response erstellen
    const response = NextResponse.next()

    // Supabase Client erstellen
    const supabase = createServerClient(
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

    // Session überprüfen
    const { data: { session } } = await supabase.auth.getSession()
    const currentPath = request.nextUrl.pathname

    // Wenn auf einer öffentlichen Route und eingeloggt, zum Dashboard weiterleiten
    if (session && isPublicRoute(currentPath)) {
      const redirectUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Wenn nicht auf einer öffentlichen Route und nicht eingeloggt, zum Login weiterleiten
    if (!session && !isPublicRoute(currentPath)) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('returnTo', currentPath)
      return NextResponse.redirect(redirectUrl)
    }

    return response

  } catch (error) {
    console.error('Middleware error:', error)
    // Bei einem Fehler zur Login-Seite umleiten, aber nur wenn nicht bereits auf einer öffentlichen Route
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