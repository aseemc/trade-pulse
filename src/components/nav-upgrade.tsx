"use client"

import { Sparkles } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavUpgrade() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild className="w-full text-primary-foreground hover:bg-primary/90" tooltip="Upgrade to Pro">
          <Link href="/upgrade" className="flex items-center">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </div>
            <div className={cn(
              "transition-[opacity,visibility,width] duration-200",
              isCollapsed ? "opacity-0 invisible w-0" : "opacity-100 visible w-auto"
            )}>
              <span>Upgrade to Pro</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
} 