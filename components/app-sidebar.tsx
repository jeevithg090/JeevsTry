"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Home, Briefcase, Calendar, MessageCircle, Settings, Bell, TrendingUp, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { useSettings } from "@/lib/settings-context"
import { getInitials } from "@/lib/auth"

function isNavItemActive(pathname: string, url: string) {
  return url === "/dashboard" ? pathname === url : pathname === url || pathname.startsWith(`${url}/`)
}

export function AppSidebar() {
  const pathname = usePathname()
  const { user, isClient, isStartup } = useUser()
  const { sidebarPosition } = useSettings()

  const mainNavItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: isClient || isStartup ? "Projects" : "Find Work",
      url: "/dashboard/freelancing",
      icon: Briefcase,
      badge: isClient || isStartup ? "3" : "12",
    },
    {
      title: "Events",
      url: "/dashboard/events",
      icon: Calendar,
      badge: "3",
    },
    {
      title: "Community",
      url: "/dashboard/community",
      icon: MessageCircle,
      badge: "5",
    },
  ]

  const quickActions = [
    {
      title: "Analytics",
      url: isClient || isStartup ? "/dashboard/freelancing?tab=analytics" : "/dashboard/freelancing?tab=my-stats",
      icon: TrendingUp,
    },
    {
      title: "Profile",
      url: "/dashboard/freelancing/profile",
      icon: UserIcon,
    },
    {
      title: "Notifications",
      url: "/dashboard/settings?tab=notifications",
      icon: Bell,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <Sidebar className="border-r" side={sidebarPosition}>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TC</span>
          </div>
          <span className="font-bold text-lg">TechCollab</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isNavItemActive(pathname, item.url)}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" aria-hidden="true" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" aria-hidden="true" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            {user?.avatar && <AvatarImage src={user.avatar} alt="" />}
            <AvatarFallback>{getInitials(user?.name ?? "")}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground truncate">{user?.company || user?.email}</p>
              {user?.role && (
                <Badge variant="secondary" className="text-xs capitalize">
                  {user.role}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
