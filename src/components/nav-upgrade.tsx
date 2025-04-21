"use client"

import { Sparkles } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavUpgrade() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/upgrade" className="flex items-center gap-2">
            <Sparkles className="size-4" />
            <span>Upgrade to Pro</span>
          </Link>
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  )
} 