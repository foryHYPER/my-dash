"use client"

import { login } from "./action"
import { useState, useEffect, Suspense } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import type React from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

// Create a separate component that uses useSearchParams
function LoginFormWithErrorHandling({ onSubmit }: { onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void> }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get('error')
    const message = searchParams.get('message')
    
    if (error) {
      console.log("Error param detected:", error, "Message:", message);
      let displayMessage = "Ein Fehler ist aufgetreten."
      
      switch(error) {
        case 'no_user':
          displayMessage = "Benutzer konnte nicht gefunden werden."
          break
        case 'no_profile':
          displayMessage = "Benutzerprofil konnte nicht gefunden werden."
          break
        case 'invalid_role':
          displayMessage = "Ungültige Benutzerrolle im Profil."
          break
        case 'profile_error':
          displayMessage = "Fehler beim Laden des Benutzerprofils: " + (message || "")
          break
        case 'auth_error':
          displayMessage = "Authentifizierungsfehler: " + (message || "")
          break
        case 'unexpected_error':
          displayMessage = "Ein unerwarteter Fehler ist aufgetreten: " + (message || "")
          break
        default:
          if (error.startsWith('profile_')) {
            displayMessage = "Profilfehler: " + error.substring(8)
          } else if (error.startsWith('auth_')) {
            displayMessage = "Anmeldefehler: " + error.substring(5)
          } else if (message) {
            displayMessage = `${error}: ${message}`
          } else {
            displayMessage = error
          }
      }
      
      console.log("Setting error message:", displayMessage);
      setErrorMessage(displayMessage)
    }
  }, [searchParams])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setIsLoading(true)
    try {
      await onSubmit(event)
    } catch (error) {
      // Check if this is a Next.js redirect "error" (not a real error)
      // NEXT_REDIRECT errors are expected when redirect() is called in a server action
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        // This is not an error, but Next.js's way of handling redirects
        console.log("Redirecting after login...")
      } else {
        console.error("Fehler beim Login:", error)
        setErrorMessage("Ein Fehler ist beim Login aufgetreten. Bitte versuchen Sie es erneut.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-md p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <p className="text-red-100 text-sm">{errorMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} method="post" className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-zinc-300">
            E-Mail
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={20} />
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="pl-10 pr-4 py-2 w-full bg-zinc-800 border-zinc-700 text-white focus:ring-0 focus:ring-offset-0 focus:outline-none focus:border-blue-500"
              placeholder="E-Mail-Adresse eingeben"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-zinc-300">
            Passwort
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={20} />
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="pl-10 pr-4 py-2 w-full bg-zinc-800 border-zinc-700 text-white focus:ring-0 focus:ring-offset-0 focus:outline-none focus:border-blue-500"
              placeholder="Passwort eingeben"
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:ring-0 focus:ring-offset-0 focus:outline-none"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Anmelden...
            </>
          ) : (
            "Anmelden"
          )}
        </Button>
      </form>
    </>
  )
}

// Loading fallback for Suspense
function LoginFormLoading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse space-y-2">
        <div className="h-5 w-20 bg-zinc-700 rounded"></div>
        <div className="h-10 bg-zinc-700 rounded"></div>
      </div>
      <div className="animate-pulse space-y-2">
        <div className="h-5 w-20 bg-zinc-700 rounded"></div>
        <div className="h-10 bg-zinc-700 rounded"></div>
      </div>
      <div className="h-10 bg-zinc-700 rounded animate-pulse"></div>
    </div>
  )
}

export default function LoginPage() {
  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget)
    await login(formData)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-zinc-900 rounded-lg shadow-xl p-8 border border-zinc-800">
          <div className="flex justify-center mb-8">
            <div className="w-48 h-48 flex items-center justify-center">
              <Image src="/logo.png" alt="RE24 Logo" width={192} height={192} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-white mb-8">Willkommen</h2>
          
          <Suspense fallback={<LoginFormLoading />}>
            <LoginFormWithErrorHandling onSubmit={handleLoginSubmit} />
          </Suspense>
          
          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-blue-500 hover:text-blue-400">
              Passwort vergessen?
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}