"use client"

import type { ReactNode } from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { parseStoredUser, USER_STORAGE_KEY, type User } from "@/lib/auth"

export type { User, UserRole } from "@/lib/auth"

interface UserContextType {
  user: User | null
  /** True until the persisted session has been read from storage. */
  isLoading: boolean
  setUser: (user: User | null) => void
  isClient: boolean
  isFreelancer: boolean
  isStartup: boolean
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

function readStoredUser(): User | null {
  try {
    return parseStoredUser(window.localStorage.getItem(USER_STORAGE_KEY))
  } catch {
    // Storage can be unavailable (private mode, blocked cookies).
    return null
  }
}

function writeStoredUser(user: User | null) {
  try {
    if (user) {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(USER_STORAGE_KEY)
    }
  } catch {
    // Ignore storage failures; the in-memory session still works.
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setUserState(readStoredUser())
    setIsLoading(false)
  }, [])

  const setUser = useCallback((next: User | null) => {
    setUserState(next)
    writeStoredUser(next)
  }, [])

  const logout = useCallback(() => setUser(null), [setUser])

  const value = useMemo<UserContextType>(
    () => ({
      user,
      isLoading,
      setUser,
      isClient: user?.role === "client",
      isFreelancer: user?.role === "freelancer",
      isStartup: user?.role === "startup",
      logout,
    }),
    [user, isLoading, setUser, logout],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
