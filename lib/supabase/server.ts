'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function createClient() {
  // cookies() muss asynchron verwendet werden in Next.js 15
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll().map(cookie => ({
          name: cookie.name,
          value: cookie.value,
        })),
        setAll: (cookies) => cookies.forEach(cookie => cookieStore.set(cookie.name, cookie.value, cookie.options))
      }
    }
  )
}