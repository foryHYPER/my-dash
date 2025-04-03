import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { AuthError } from '@supabase/supabase-js';

export async function updateSession(request: NextRequest) {
  // API-Routen überspringen
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options: cookieOptions }) =>
            supabaseResponse.cookies.set(name, value, cookieOptions)
          );
        },
      },
    }
  );

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error: unknown) {
    if (error instanceof AuthError && error.code !== 'refresh_token_not_found') {
      console.error('Unexpected error during token refresh:', error);
    }
    // Bei 'refresh_token_not_found' einfach den Fehler ignorieren
  }

  // Falls kein User vorhanden ist und der Request nicht auf Login oder Auth-Seiten gerichtet ist,
  // leite den Nutzer zur Login-Seite um.
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}