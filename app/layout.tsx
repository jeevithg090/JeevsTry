import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Inter } from 'next/font/google'
import "./globals.css"
import "@/styles/settings.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "@/lib/settings-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TechCollab - All-in-One Tech Collaboration Platform",
  description: "Connect, collaborate, and grow with freelancers, events, and communities",
  generator: "v0.dev"
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <SettingsProvider>
            {children}
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
