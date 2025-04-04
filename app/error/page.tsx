'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Suspense } from 'react';

const errorMessages = {
  missing_env_vars: {
    title: 'Konfigurationsfehler',
    description: 'Die Umgebungsvariablen für Supabase fehlen. Der Administrator muss die Anwendung korrekt konfigurieren.',
    solution: 'Bitte stelle sicher, dass NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in der Umgebung definiert sind.',
    adminOnly: true
  },
  auth_error: {
    title: 'Authentifizierungsfehler',
    description: 'Es gab ein Problem bei der Anmeldung.',
    solution: 'Bitte versuche es erneut oder wende dich an den Support.',
    adminOnly: false
  },
  unknown_error: {
    title: 'Unerwarteter Fehler',
    description: 'Es ist ein unerwarteter Fehler aufgetreten.',
    solution: 'Bitte versuche es später erneut oder wende dich an den Support.',
    adminOnly: false
  }
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const messageKey = searchParams.get('message') || 'unknown_error';
  const errorInfo = errorMessages[messageKey as keyof typeof errorMessages] || errorMessages.unknown_error;
  
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900 mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {errorInfo.title}
        </h1>
        
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {errorInfo.description}
        </p>
        
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md w-full text-left">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Lösung:</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {errorInfo.solution}
          </p>
          
          {errorInfo.adminOnly && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                Diese Fehler ist nur für Administratoren sichtbar.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="pt-4 flex justify-center">
        <Link
          href="/"
          className="px-6 py-2 text-sm font-medium text-center text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Suspense fallback={
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
          <AlertTriangle className="mx-auto w-8 h-8 text-amber-600" />
          <p>Fehlerdetails werden geladen...</p>
        </div>
      }>
        <ErrorContent />
      </Suspense>
    </div>
  );
} 