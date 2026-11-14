"use client"

import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { pickAllowed } from "@/lib/utils"

export const SIDEBAR_POSITIONS = ["left", "right"] as const
export type SidebarPosition = (typeof SIDEBAR_POSITIONS)[number]

export const FONT_SIZES = ["small", "default", "large"] as const
export type FontSize = (typeof FONT_SIZES)[number]

const SIDEBAR_KEY = "sidebarPosition"
const FONT_SIZE_KEY = "fontSize"

type SettingsContextType = {
  sidebarPosition: SidebarPosition
  setSidebarPosition: (position: SidebarPosition) => void
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

function readSetting(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeSetting(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Ignore storage failures; settings still apply for this session.
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Start from defaults on both server and client to avoid hydration
  // mismatches, then load persisted preferences after mount.
  const [sidebarPosition, setSidebarPosition] = useState<SidebarPosition>("left")
  const [fontSize, setFontSize] = useState<FontSize>("default")
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setSidebarPosition(pickAllowed(readSetting(SIDEBAR_KEY), SIDEBAR_POSITIONS, "left"))
    setFontSize(pickAllowed(readSetting(FONT_SIZE_KEY), FONT_SIZES, "default"))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    writeSetting(SIDEBAR_KEY, sidebarPosition)
    writeSetting(FONT_SIZE_KEY, fontSize)
    const root = document.documentElement
    root.classList.remove(...FONT_SIZES.map((size) => `text-${size}`))
    root.classList.add(`text-${fontSize}`)
  }, [hydrated, sidebarPosition, fontSize])

  const value = useMemo(
    () => ({ sidebarPosition, setSidebarPosition, fontSize, setFontSize }),
    [sidebarPosition, fontSize],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
