"use client"

import { LogOut, Moon, Sun, Loader2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationsPopover } from "@/components/notifications-popover"
import { useTheme } from "next-themes"
import { signOut } from "@/lib/actions/auth"
import { cn } from "@/lib/utils"

export function NavActions() {
  const { setTheme } = useTheme()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut()
    setIsLoggingOut(false)
  }

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu open={isThemeMenuOpen} onOpenChange={setIsThemeMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={cn(isThemeMenuOpen && "bg-muted")}>
            <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <NotificationsPopover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen} />

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={cn(isLoggingOut && "bg-muted")}
      >
        {isLoggingOut ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <LogOut className="size-4" />
        )}
        <span className="sr-only">Logout</span>
      </Button>
    </div>
  )
} 