import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Return `value` if it is one of `allowed`, otherwise `fallback`. */
export function pickAllowed<T extends string>(value: string | null | undefined, allowed: readonly T[], fallback: T): T {
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : fallback
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
