import { createClient } from '@/lib/supabase/server'

export type Profile = {
  id: string
  role: 'candidate' | 'company'
  created_at: string
  updated_at: string
  full_name?: string
  avatar_url?: string
  email?: string
}

export async function getProfile() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return {
    ...profile,
    email: user.email,
  }
} 