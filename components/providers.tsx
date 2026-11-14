"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SettingsProvider } from "@/lib/settings-context"
import { UserProvider } from "@/lib/user-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SettingsProvider>
        <UserProvider>
          {children}
          <Toaster />
        </UserProvider>
      </SettingsProvider>
    </ThemeProvider>
  )
}
