"use client"

import { login } from "./action"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import type React from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      let message = "Ein Fehler ist aufgetreten."
      
      switch(error) {
        case 'no_user':
          message = "Benutzer konnte nicht gefunden werden."
          break
        case 'no_profile':
          message = "Benutzerprofil konnte nicht gefunden werden."
          break
        case 'invalid_role':
          message = "Ungültige Benutzerrolle im Profil."
          break
        case 'unexpected_profile_error':
          message = "Fehler beim Laden des Benutzerprofils."
          break
        case 'unexpected_error':
          message = "Ein unerwarteter Fehler ist aufgetreten."
          break
        default:
          if (error.startsWith('profile_')) {
            message = "Profilfehler: " + error.substring(8)
          } else {
            message = error
          }
      }
      
      setErrorMessage(message)
    }
  }, [searchParams])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    const formData = new FormData(event.currentTarget)
    setIsLoading(true)
    try {
      await login(formData)
    } catch (error) {
      console.error("Fehler beim Login:", error)
    } finally {
      setIsLoading(false)
    }
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