"use client"

import * as React from "react"
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Sparkles,
  SquareActivity,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { FeedbackModal } from "@/components/feedback-modal"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = React.useState(false)
  const router = useRouter()

  const applicationItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Feedback",
      icon: MessageSquare,
      onClick: () => setIsFeedbackModalOpen(true),
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ]

  const appUpgrade = [
    {
      title: "Upgrade to Pro",
      onClick: () => router.push("/settings?section=account"),
      icon: Sparkles,
      highlight: true
    },
  ]

  return (
    <>
      <Sidebar collapsible="icon" {...props} className="pl-1">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center gap-2 mt-2"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <SquareActivity className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Trade Pulse</span>
                  <span className="truncate text-xs text-muted-foreground">Free</span>
                </div>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={applicationItems} label="Application" />
        </SidebarContent>
        <div className="mt-auto">
          <NavMain items={appUpgrade} label="" />
        </div>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>

      <FeedbackModal isOpen={isFeedbackModalOpen} onOpenChange={setIsFeedbackModalOpen} />
    </>
  )
}
