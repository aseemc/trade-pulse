"use client"

import { type LucideIcon } from "lucide-react"
import Link from "next/link"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

// Updated NavItem type: url and onClick are optional and mutually exclusive enforced by usage
interface BaseNavItem {
  title: string
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string // Sub-items always have a URL
  }[],
  highlight?: boolean
}

interface LinkNavItem extends BaseNavItem {
  url: string
  onClick?: never // Ensure onClick is not provided if url exists
}

interface ButtonNavItem extends BaseNavItem {
  url?: never // Ensure url is not provided if onClick exists
  onClick: () => void
}

type NavItem = LinkNavItem | ButtonNavItem

export function NavMain({
  items,
  label,
}: {
  items: NavItem[]
  label: string
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Define the content parts
          const Icon = item.icon ? <item.icon className="size-4 mr-2 flex-shrink-0" /> : null
          const Title = <span className="truncate">{item.title}</span>

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild={!!item.url}>
                {item.url ? (
                  <Link href={item.url} className="flex items-center">
                    {Icon}
                    {Title}
                  </Link>
                ) : (
                  <button onClick={item.onClick} className="flex items-center gap-2 cursor-pointer">
                    {Icon}
                    {Title}
                  </button>
                )}
              </SidebarMenuButton>
              {item.items && (
                <SidebarMenuSub>
                  {item.items.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
