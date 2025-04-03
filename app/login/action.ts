'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Umwandeln von FormData in ein Objekt
  const formDataObj = Object.fromEntries(formData)
  const email = formDataObj.email as string
  const password = formDataObj.password as string

  console.log("Login-Versuch für:", email);

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    console.error("Login-Fehler:", error.message);
    redirect('/error')
  }

  console.log("Login erfolgreich, Benutzer:", data.user?.id);
  console.log("Session gültig:", !!data.session);

  revalidatePath('/dashboard')
  redirect('/dashboard')
}