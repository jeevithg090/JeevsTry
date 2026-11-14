"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Bell, Moon, Plus, Search, Sun } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getInitials } from "@/lib/auth"
import { useUser } from "@/lib/user-context"

// Sample notifications for the demo; there is no notifications API yet.
const NOTIFICATIONS = [
  { id: "1", title: "New gig proposal received", time: "2 minutes ago" },
  { id: "2", title: "Event reminder: React Meetup", time: "1 hour ago" },
  { id: "3", title: "New message in #general", time: "3 hours ago" },
]

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()
  const { user, isClient, isStartup, logout } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  const handleLogout = () => {
    logout()
    // Full navigation so the dashboard guard doesn't race this redirect and all
    // in-memory demo state (chat, drafts) is cleared along with the session.
    window.location.assign("/")
  }

  const displayName = user?.name ?? "Guest"

  return (
    <header className="border-b bg-background px-4 py-3 md:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <SidebarTrigger aria-label="Toggle sidebar" />
          <form role="search" className="relative hidden md:block" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="dashboard-search" className="sr-only">
              Search
            </label>
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="dashboard-search"
              type="search"
              placeholder="Search projects, events, people..."
              className="w-64 pl-10"
            />
          </form>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Create</span>
                <span className="sr-only sm:hidden">Create</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(isClient || isStartup) && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/freelancing/create-gig">Post a project</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/dashboard/events/create">Host an event</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/community">Start a discussion</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label={`Notifications (${NOTIFICATIONS.length} unread)`}
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs">
                  {NOTIFICATIONS.length}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {NOTIFICATIONS.map((notification) => (
                <DropdownMenuItem key={notification.id}>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="Account menu">
                <Avatar className="h-8 w-8">
                  {user?.avatar && <AvatarImage src={user.avatar} alt="" />}
                  <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium">{displayName}</p>
                {user?.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/freelancing/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings?tab=billing">Billing</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
