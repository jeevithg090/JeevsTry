/**
 * Client-side demo authentication helpers.
 *
 * TechCollab currently has no backend: accounts are created in the browser and
 * persisted to localStorage so the dashboard can be explored end to end. These
 * helpers are pure so the validation and (de)serialisation rules can be tested
 * in isolation and reused once a real auth provider is wired in.
 */

export const USER_ROLES = ["freelancer", "client", "startup"] as const
export type UserRole = (typeof USER_ROLES)[number]

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  company?: string
  verified: boolean
  joinedAt: string
}

export const USER_STORAGE_KEY = "techcollab_user"
export const MIN_PASSWORD_LENGTH = 8

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (USER_ROLES as readonly string[]).includes(value)
}

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim())
}

/**
 * Safely parse a user previously written to storage. Returns `null` for
 * missing, malformed or tampered data instead of throwing during render.
 */
export function parseStoredUser(raw: string | null | undefined): User | null {
  if (!raw) return null
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return null
  }
  if (typeof data !== "object" || data === null) return null
  const candidate = data as Record<string, unknown>
  if (
    typeof candidate.id !== "string" ||
    typeof candidate.name !== "string" ||
    typeof candidate.email !== "string" ||
    typeof candidate.joinedAt !== "string" ||
    !isUserRole(candidate.role)
  ) {
    return null
  }
  return {
    id: candidate.id,
    name: candidate.name,
    email: candidate.email,
    role: candidate.role,
    joinedAt: candidate.joinedAt,
    verified: candidate.verified === true,
    avatar: typeof candidate.avatar === "string" ? candidate.avatar : undefined,
    company: typeof candidate.company === "string" ? candidate.company : undefined,
  }
}

export interface SignUpInput {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  role: string
  company?: string
  agreeToTerms: boolean
}

export type SignUpErrors = Partial<Record<keyof SignUpInput, string>>

export function validateSignUp(input: SignUpInput): SignUpErrors {
  const errors: SignUpErrors = {}
  if (!input.firstName.trim()) errors.firstName = "First name is required."
  if (!input.lastName.trim()) errors.lastName = "Last name is required."
  if (!isValidEmail(input.email)) errors.email = "Enter a valid email address."
  if (input.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
  }
  if (input.password !== input.confirmPassword) errors.confirmPassword = "Passwords don't match."
  if (!isUserRole(input.role)) errors.role = "Choose how you'll use TechCollab."
  if (!input.agreeToTerms) errors.agreeToTerms = "You must accept the terms to continue."
  return errors
}

export interface SignInInput {
  email: string
  password: string
}

export type SignInErrors = Partial<Record<keyof SignInInput, string>>

export function validateSignIn(input: SignInInput): SignInErrors {
  const errors: SignInErrors = {}
  if (!isValidEmail(input.email)) errors.email = "Enter a valid email address."
  if (!input.password) errors.password = "Password is required."
  return errors
}

export function hasErrors(errors: object): boolean {
  return Object.keys(errors).length > 0
}

/** Derive a readable display name from an email's local part ("jane.doe" -> "Jane Doe"). */
export function nameFromEmail(email: string): string {
  const local = email.trim().split("@")[0] ?? ""
  const words = local
    .split(/[._\-+]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  return words.length > 0 ? words.join(" ") : "TechCollab Member"
}

/** Up to two uppercase initials for avatar fallbacks. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  const first = parts[0].charAt(0)
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : ""
  return (first + last).toUpperCase()
}

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export interface DemoUserInput {
  name: string
  email: string
  role: UserRole
  company?: string
}

export function createDemoUser(input: DemoUserInput, now: Date = new Date()): User {
  const company = input.company?.trim()
  return {
    id: generateId(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    role: input.role,
    company: company ? company : undefined,
    verified: false,
    joinedAt: now.toISOString(),
  }
}

/**
 * Only allow same-origin, app-relative redirect targets (e.g. "/dashboard/events")
 * to prevent open redirects via a crafted `?next=` parameter.
 */
export function safeRedirectPath(target: string | null | undefined, fallback = "/dashboard"): string {
  if (!target || !target.startsWith("/") || target.startsWith("//") || target.includes("\\")) {
    return fallback
  }
  return target
}
