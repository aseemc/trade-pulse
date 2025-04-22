"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useProfileContext } from "@/contexts/profile-context"
import { Skeleton } from "@/components/ui/skeleton"

export function NavUser() {
  const { profile, loading } = useProfileContext()

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="grid flex-1 gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!profile) return null

  const initials = `${profile.first_name[0]}${profile.last_name[0]}`
  const fullName = `${profile.first_name} ${profile.last_name}`

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center gap-2 mb-4"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={profile.avatar || undefined} alt={fullName} />
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm">
            <span className="truncate font-medium">{fullName}</span>
            <span className="truncate text-xs text-muted-foreground">{profile.email}</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
