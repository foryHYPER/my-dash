"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRole: 'company' | 'candidate'
}

export function RoleGuard({ children, allowedRole }: RoleGuardProps) {
  const router = useRouter()

  useEffect(() => {
    const checkRole = async () => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== allowedRole) {
        router.push(profile?.role === 'company' ? '/dashboard/company' : '/dashboard/candidate')
      }
    }

    checkRole()
  }, [router, allowedRole])

  return <>{children}</>
} 