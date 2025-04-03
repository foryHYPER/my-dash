"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRole: 'admin' | 'company' | 'candidate'
}

export function RoleGuard({ children, allowedRole }: RoleGuardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkRole = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const supabase = createClient()
        console.log("RoleGuard: Checking user role")
        
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error("RoleGuard: Error getting user", userError)
          setError("Fehler beim Laden des Benutzers")
          router.push('/login')
          return
        }
        
        if (!user) {
          console.error("RoleGuard: No user found")
          router.push('/login')
          return
        }

        console.log("RoleGuard: User found, checking profile")
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error("RoleGuard: Error getting profile", profileError)
          setError("Fehler beim Laden des Profils")
          return
        }

        if (!profile) {
          console.error("RoleGuard: No profile found")
          setError("Kein Profil gefunden")
          return
        }

        console.log("RoleGuard: Profile found, role =", profile.role)
        if (profile.role !== allowedRole) {
          console.log("RoleGuard: Role mismatch, redirecting")
          if (profile.role === 'admin') {
            router.push('/dashboard/admin');
          } else if (profile.role === 'company') {
            router.push('/dashboard/company');
          } else {
            router.push('/dashboard/candidate');
          }
          return;
        }

        // Role matched the allowed role, show content
        console.log("RoleGuard: Role matches allowed role, showing content")
        setIsLoading(false)
      } catch (err) {
        console.error("RoleGuard: Unexpected error", err)
        setError("Ein unerwarteter Fehler ist aufgetreten")
      } finally {
        // Ensure loading is set to false even if there was an error
        setIsLoading(false)
      }
    }

    checkRole()
  }, [router, allowedRole])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-muted-foreground">Lade Benutzerinformationen...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Fehler</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 