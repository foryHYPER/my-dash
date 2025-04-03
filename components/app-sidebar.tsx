"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/supabase"
import { AppSidebar as BaseAppSidebar } from "./app-sidebar-base"
import { Loader2 } from "lucide-react"

export function AppSidebar() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("AppSidebar: Fetching user profile")
        setIsLoading(true)
        setError(null)
        
        const supabase = createClient()
        
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('AppSidebar: Error fetching user:', userError)
          setError('Fehler beim Laden des Benutzers')
          setIsLoading(false)
          return
        }
        
        if (!user) {
          console.error('AppSidebar: No user found')
          setError('Kein Benutzer gefunden')
          setIsLoading(false)
          return
        }

        console.log("AppSidebar: User found, fetching profile")
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('AppSidebar: Error fetching profile:', profileError)
          setError('Fehler beim Laden des Profils')
          setIsLoading(false)
          return
        }

        if (!profile) {
          console.error('AppSidebar: No profile found')
          setError('Kein Profil gefunden')
          setIsLoading(false)
          return
        }

        console.log("AppSidebar: Profile loaded successfully")
        setProfile({
          ...profile,
          email: user.email,
        })
        setIsLoading(false)
      } catch (err) {
        console.error('AppSidebar: Unexpected error:', err)
        setError('Ein unerwarteter Fehler ist aufgetreten')
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (isLoading) {
    return (
      <div className="flex w-56 flex-col border-r bg-zinc-900 p-4">
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </div>
        <div className="mt-4 space-y-2">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-10 rounded-md bg-zinc-800 animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex w-56 flex-col border-r bg-zinc-900 p-4">
        <div className="bg-red-900/20 border border-red-900/30 rounded-md p-4 text-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex w-56 flex-col border-r bg-zinc-900 p-4">
        <div className="bg-amber-900/20 border border-amber-900/30 rounded-md p-4 text-center">
          <p className="text-sm text-amber-500">Kein Benutzerprofil verfügbar</p>
        </div>
      </div>
    )
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
