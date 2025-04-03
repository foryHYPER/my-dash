import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  try {
    // Statische Ressourcen überspringen
    if (
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname.startsWith('/static') ||
      request.nextUrl.pathname.includes('.')
    ) {
      return NextResponse.next()
    }

    let response = NextResponse.next()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value
          },
          set(name, value, options) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name, options) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    // Öffentliche Routen
    const publicRoutes = ['/login', '/auth', '/register']
    if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
      return response
    }

    // Wenn kein Session und nicht auf öffentlicher Route, redirect zu Login
    if (!session) {
      const redirectUrl = new URL('/login', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Session existiert, erlaube Zugriff
    return response

  } catch (error) {
    console.error('Middleware error:', error)
    // Bei einem Fehler zur Login-Seite umleiten
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
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