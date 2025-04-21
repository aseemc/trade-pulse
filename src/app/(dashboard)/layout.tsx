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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <span className="text-2xl font-bold text-primary">
              {pageTitle}
            </span>
          </div>
          <NavActions />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
} 