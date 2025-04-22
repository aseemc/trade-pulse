"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { NavActions } from "@/components/nav-actions"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { usePathname } from "next/navigation"
import { ProfileProvider } from "@/contexts/profile-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const segments = pathname.split("/")
  const lastSegment = segments[segments.length - 1]
  const pageTitle = lastSegment 
    ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
    : "Dashboard"

  return (
    <ProfileProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="border-1 rounded-lg border-transparent m-2 shadow-md">
          <header className="flex h-14 shrink-0 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <span className="text-md font-semibold text-primary">
                {pageTitle}
              </span>
            </div>
            <NavActions />
          </header>
          <Separator />

          {children}
        </SidebarInset>
      </SidebarProvider>
    </ProfileProvider>
  )
} 