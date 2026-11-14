"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@/lib/user-context"

/**
 * Authenticated app chrome. Redirects to sign-in when there is no session.
 * Demo auth is client-side only, so this guard is a UX convenience rather than
 * a security boundary; real protection belongs on the server once a backend exists.
 */
export function DashboardShell({ children }: { children: ReactNode }) {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/auth/signin?next=${encodeURIComponent(pathname)}`)
    }
  }, [isLoading, user, router, pathname])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6" aria-busy="true">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <span className="sr-only">Loading your workspace…</span>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main id="main-content" className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
