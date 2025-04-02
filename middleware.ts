import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Definiere die öffentlichen und geschützten Routen
const publicRoutes = ['/login', '/auth', '/register']
const dashboardRoutes = ['/dashboard/company', '/dashboard/candidate']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route))
  const isDashboardRoute = dashboardRoutes.some(route => path.startsWith(route))

  // Wenn kein User eingeloggt ist und die Route nicht öffentlich ist
  if (!user && !isPublicRoute) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect_to', path)
    return NextResponse.redirect(redirectUrl)
  }

  // Wenn ein User eingeloggt ist
  if (user) {
    // Hole das Profil mit der Rolle
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Wenn der User auf einer öffentlichen Route ist (z.B. login)
    if (isPublicRoute) {
      const redirectPath = profile?.role === 'company' 
        ? '/dashboard/company' 
        : '/dashboard/candidate'
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }

    // Überprüfe Rollenzugriff für Dashboard-Routen
    if (isDashboardRoute) {
      const isCompanyRoute = path.startsWith('/dashboard/company')
      const isCandidateRoute = path.startsWith('/dashboard/candidate')

      if (
        (isCompanyRoute && profile?.role !== 'company') ||
        (isCandidateRoute && profile?.role !== 'candidate')
      ) {
        const correctPath = profile?.role === 'company' 
          ? '/dashboard/company' 
          : '/dashboard/candidate'
        return NextResponse.redirect(new URL(correctPath, request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 