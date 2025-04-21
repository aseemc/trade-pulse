"use client"

import { Bell, Check, CheckCheck } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// This is sample data. Replace with your actual notification data structure
const notifications = [
  {
    id: 1,
    title: "New Trade Alert",
    message: "BTC/USD has reached your target price of $50,000",
    timestamp: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    title: "Account Update",
    message: "Your account has been verified successfully",
    timestamp: "1 hour ago",
    read: true,
  },
  {
    id: 3,
    title: "Market Update",
    message: "ETH/USD is trending upward with 5% increase",
    timestamp: "2 hours ago",
    read: true,
  },
]

export function NotificationsPopover() {
  const [selectedNotification, setSelectedNotification] = useState<typeof notifications[0] | null>(null)
  const [localNotifications, setLocalNotifications] = useState(notifications)
  const unreadCount = localNotifications.filter(n => !n.read).length

  const markAllAsRead = () => {
    setLocalNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0 -top-0 flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex h-[50vh] min-h-[300px] flex-col">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h4 className="font-medium">Notifications</h4>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  onClick={markAllAsRead}
                >
                  <CheckCheck className="size-3" />
                  Mark all read
                </Button>
              )}
            </div>
            <div className="flex-1 overflow-auto">
              {localNotifications.length === 0 ? (
                <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                <div className="divide-y">
                  {localNotifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => setSelectedNotification(notification)}
                      className={cn(
                        "group flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                        !notification.read && "bg-muted/30"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{notification.title}</span>
                          {!notification.read && (
                            <span className="size-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          <Check className="size-3" />
                          <span>Mark as read</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {localNotifications.length > 0 && (
              <div className="border-t p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground hover:text-foreground"
                >
                  View all notifications
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedNotification?.title}</DialogTitle>
            <DialogDescription>
              {selectedNotification?.timestamp}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              {selectedNotification?.message}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 