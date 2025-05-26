"use client"

import { createContext, useContext, useEffect, useState } from "react"

type SettingsContextType = {
  sidebarPosition: "left" | "right"
  setSidebarPosition: (position: "left" | "right") => void
  fontSize: "small" | "default" | "large"
  setFontSize: (size: "small" | "default" | "large") => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [sidebarPosition, setSidebarPosition] = useState<"left" | "right">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("sidebarPosition") as "left" | "right") || "left"
    }
    return "left"
  })

  const [fontSize, setFontSize] = useState<"small" | "default" | "large">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("fontSize") as "small" | "default" | "large") || "default"
    }
    return "default"
  })

  useEffect(() => {
    localStorage.setItem("sidebarPosition", sidebarPosition)
    // Update root element with font size class
    const root = document.documentElement
    root.classList.remove("text-small", "text-default", "text-large")
    root.classList.add(`text-${fontSize}`)
  }, [sidebarPosition, fontSize])

  return (
    <SettingsContext.Provider
      value={{
        sidebarPosition,
        setSidebarPosition,
        fontSize,
        setFontSize,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}