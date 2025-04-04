'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AccessDenied() {
  const router = useRouter()
  const supabase = createClient()
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Zugriff verweigert
          </h1>
          
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Du hast nicht die erforderlichen Berechtigungen, um auf diese Seite zuzugreifen.
          </p>
          
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md w-full text-left mb-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Mögliche Gründe:</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
              <li>Dein Konto hat nicht die erforderliche Rolle</li>
              <li>Deine Sitzung ist abgelaufen</li>
              <li>Der Administrator hat deine Berechtigungen geändert</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-between gap-2">
          <Link
            href="/"
            className="flex-1 px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Zur Startseite
          </Link>
          <button
            onClick={handleSignOut}
            className="flex-1 px-4 py-2 text-sm font-medium text-center text-gray-900 bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            Abmelden
          </button>
        </div>
      </div>
    </div>
  )
} 