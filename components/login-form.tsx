"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/app/actions/auth"

// Zod Schema für Login-Validierung
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-Mail ist erforderlich")
    .email("Ungültige E-Mail-Adresse"),
  password: z
    .string()
    .min(1, "Passwort ist erforderlich")
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [lastAttemptTime, setLastAttemptTime] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Rate limiting
    const now = Date.now()
    if (loginAttempts >= 5 && (now - lastAttemptTime) < 300000) {
      setErrors({ email: "Zu viele Anmeldeversuche. Bitte versuchen Sie es später erneut." })
      return
    }

    // Validate form data with Zod
    const result = loginSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {}
      result.error.issues.forEach(issue => {
        const path = issue.path[0] as keyof LoginFormData
        fieldErrors[path] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      setLoginAttempts(prev => prev + 1)
      setLastAttemptTime(now)

      const result = await login(formData)

      if (!result.success) {
        throw new Error(result.error)
      }

      setLoginAttempts(0)
      router.refresh()
      
    } catch (err) {
      console.error('Login error:', err)
      setErrors({ 
        email: err instanceof Error ? err.message : "Ein Fehler ist aufgetreten" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className={className} onSubmit={handleSubmit} {...props}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">E-Mail</Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Passwort</Label>
          <Input
            id="password"
            type="password"
            autoCapitalize="none"
            autoComplete="current-password"
            disabled={isLoading}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        <Button disabled={isLoading}>
          {isLoading && (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
          )}
          Anmelden
        </Button>
      </div>
    </form>
  )
}
