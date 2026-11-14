"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Eye, EyeOff, Briefcase, Building, Users, Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { FieldError } from "@/components/field-error"
import { createDemoUser, hasErrors, isUserRole, validateSignUp, type SignUpErrors } from "@/lib/auth"
import { useUser } from "@/lib/user-context"

export default function SignUpPage() {
  const router = useRouter()
  const { setUser } = useUser()
  const [errors, setErrors] = useState<SignUpErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    role: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  })

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const needsCompany = selectedRole === "client" || selectedRole === "startup"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validateSignUp(formData)
    if (needsCompany && !formData.company.trim()) {
      validation.company = selectedRole === "startup" ? "Startup name is required." : "Company name is required."
    }
    setErrors(validation)
    if (hasErrors(validation) || !isUserRole(formData.role)) return

    setIsLoading(true)
    setUser(
      createDemoUser({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: formData.role,
        company: needsCompany ? formData.company : undefined,
      }),
    )
    router.push("/dashboard")
  }

  const roleOptions = [
    {
      value: "freelancer",
      label: "Freelancer",
      description: "I want to find projects, showcase my skills, and work with amazing clients",
      icon: Briefcase,
      color: "blue",
    },
    {
      value: "client",
      label: "Client",
      description: "I need to hire talented freelancers for my business projects",
      icon: Users,
      color: "green",
    },
    {
      value: "startup",
      label: "Startup",
      description: "I'm building a startup and need to find co-founders and talent",
      icon: Building,
      color: "purple",
    },
  ]

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/auth" aria-label="Back to account options">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Create Your Account</h1>
          <p className="text-muted-foreground">Join TechCollab and start collaborating</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your account to access all platform features</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Role Selection - First Step */}
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">What brings you to TechCollab?</h2>
                <p className="text-muted-foreground text-sm">Choose the option that best describes you</p>
              </div>

              <div className="grid gap-3">
                {roleOptions.map((role) => (
                  <button
                    type="button"
                    key={role.value}
                    aria-pressed={selectedRole === role.value}
                    className={`relative w-full text-left cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      selectedRole === role.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => {
                      setSelectedRole(role.value)
                      handleInputChange("role", role.value)
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-lg ${
                          selectedRole === role.value ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        <role.icon
                          className={`h-6 w-6 ${
                            selectedRole === role.value
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-semibold text-lg">{role.label}</h3>
                          {selectedRole === role.value && (
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" aria-hidden="true" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{role.description}</p>

                        {/* Role-specific benefits */}
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-2">
                            {role.value === "freelancer" && (
                              <>
                                <Badge variant="outline" className="text-xs">
                                  Find Projects
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Build Portfolio
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Earn Money
                                </Badge>
                              </>
                            )}
                            {role.value === "client" && (
                              <>
                                <Badge variant="outline" className="text-xs">
                                  Hire Talent
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Manage Projects
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Scale Team
                                </Badge>
                              </>
                            )}
                            {role.value === "startup" && (
                              <>
                                <Badge variant="outline" className="text-xs">
                                  Find Co-founders
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Build MVP
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Network
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <FieldError id="role-error" message={errors.role} />

              {!selectedRole && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Please select your role to continue</p>
                </div>
              )}
            </div>

            {selectedRole && <Separator className="my-6" />}

            {/* Show form only after role selection */}
            {selectedRole && (
              <>
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        aria-invalid={Boolean(errors.firstName)}
                        aria-describedby={errors.firstName ? "firstName-error" : undefined}
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                      <FieldError id="firstName-error" message={errors.firstName} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        aria-invalid={Boolean(errors.lastName)}
                        aria-describedby={errors.lastName ? "lastName-error" : undefined}
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                      <FieldError id="lastName-error" message={errors.lastName} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                    <FieldError id="email-error" message={errors.email} />
                  </div>

                  {/* Company field for clients and startups */}
                  {(selectedRole === "client" || selectedRole === "startup") && (
                    <div className="space-y-2">
                      <Label htmlFor="company">{selectedRole === "startup" ? "Startup Name" : "Company Name"} *</Label>
                      <Input
                        id="company"
                        aria-invalid={Boolean(errors.company)}
                        aria-describedby={errors.company ? "company-error" : undefined}
                        placeholder={selectedRole === "startup" ? "Your Startup" : "Your Company"}
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                      />
                      <FieldError id="company-error" message={errors.company} />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          aria-invalid={Boolean(errors.password)}
                          aria-describedby={errors.password ? "password-error" : undefined}
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        aria-invalid={Boolean(errors.confirmPassword)}
                        aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        required
                      />
                      <FieldError id="confirmPassword-error" message={errors.confirmPassword} />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Terms and Newsletter */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the Terms of Service and Privacy Policy *
                    </Label>
                  </div>
                  <FieldError id="terms-error" message={errors.agreeToTerms} />

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={formData.subscribeNewsletter}
                      onCheckedChange={(checked) => handleInputChange("subscribeNewsletter", checked as boolean)}
                    />
                    <Label htmlFor="newsletter" className="text-sm">
                      Subscribe to our newsletter for updates and tips
                    </Label>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12" disabled={isLoading || !selectedRole}>
                  {isLoading
                    ? "Creating Account..."
                    : `Create ${selectedRole === "freelancer" ? "Freelancer" : selectedRole === "startup" ? "Startup" : "Client"} Account`}
                </Button>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/signin" className="text-primary hover:underline">
                    Sign in here
                  </Link>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
