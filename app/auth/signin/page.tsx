"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { FieldError } from "@/components/field-error"
import {
  createDemoUser,
  hasErrors,
  nameFromEmail,
  parseStoredUser,
  safeRedirectPath,
  USER_STORAGE_KEY,
  validateSignIn,
  type SignInErrors,
} from "@/lib/auth"
import { useUser } from "@/lib/user-context"

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<SignInErrors>({})
  const router = useRouter()
  const { setUser } = useUser()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validateSignIn({ email, password })
    setErrors(validation)
    if (hasErrors(validation)) return

    setIsLoading(true)
    // Demo auth: reuse the profile created at sign-up for this email if there is
    // one, otherwise start a new freelancer profile.
    let existing = null
    try {
      existing = parseStoredUser(window.localStorage.getItem(USER_STORAGE_KEY))
    } catch {
      existing = null
    }
    const normalizedEmail = email.trim().toLowerCase()
    setUser(
      existing && existing.email === normalizedEmail
        ? existing
        : createDemoUser({ name: nameFromEmail(email), email, role: "freelancer" }),
    )
    router.push(safeRedirectPath(new URLSearchParams(window.location.search).get("next")))
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <Link
          href="/auth"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to options
        </Link>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">TC</span>
          </div>
          <span className="font-bold text-xl">TechCollab</span>
        </div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Sign in to your account to continue</p>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="pl-10"
                  required
                />
              </div>
              <FieldError id="email-error" message={errors.email} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <FieldError id="password-error" message={errors.password} />
            </div>

            <p className="text-xs text-muted-foreground">
              Demo mode: accounts are stored only in this browser and any password is accepted.
            </p>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/auth/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
