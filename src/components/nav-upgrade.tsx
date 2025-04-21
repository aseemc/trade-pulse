"use client"

import { Sparkles } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function NavUpgrade() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/upgrade" className="flex items-center">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground">
                  <Sparkles className="size-4" />
                </div>
                <div className={cn(
                  "ml-2 transition-[opacity,visibility,width] duration-200",
                  isCollapsed ? "opacity-0 invisible w-0 -ml-2" : "opacity-100 visible w-auto"
                )}>
                  <span>Upgrade to Pro</span>
                </div>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" align="center" hidden={!isCollapsed}>
            Upgrade to Pro
          </TooltipContent>
        </Tooltip>
      </SidebarMenuItem>
    </SidebarMenu>
  )
} 