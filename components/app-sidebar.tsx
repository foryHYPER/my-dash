"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/supabase/profiles"
import { AppSidebar as BaseAppSidebar } from "./app-sidebar-base"

export function AppSidebar() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setIsLoading(false)
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        setIsLoading(false)
        return
      }

      setProfile({
        ...profile,
        email: user.email,
      })
      setIsLoading(false)
    }

    fetchProfile()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!profile) {
    return null
  }

  const role = profile.role || 'candidate'

  return (
    <BaseAppSidebar
      user={{
        name: profile.full_name || profile.email?.split('@')[0] || 'User',
        email: profile.email || '',
        avatar: './avatar.png',
        role: role,
      }}
    />
  )
}
