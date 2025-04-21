"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  MessageSquare,
  PieChart,
  Settings,
  Settings2,
  Sparkles,
  SquareActivity,
  SquareTerminal,
  User,
} from "lucide-react"

import { FeedbackModal } from "@/components/feedback-modal"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = React.useState(false)

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
      url: "/upgrade",
      icon: Sparkles,
      highlight: true,
    },
  ]

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
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
                      <span className="truncate text-xs">Premium</span>
                    </div>
                  </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={applicationItems} label="Application" />
        </SidebarContent>
        <div className="mt-auto">
          <NavMain items={appUpgrade} label="Upgrade" />
        </div>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <FeedbackModal isOpen={isFeedbackModalOpen} onOpenChange={setIsFeedbackModalOpen} />
    </>
  )
}
