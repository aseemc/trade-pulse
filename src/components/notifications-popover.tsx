"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

// Updated sample data structure
type Notification = {
  id: number
  avatarUrl?: string
  avatarFallback: string
  senderName: string
  role?: "admin" | "following"
  action: string
  timestamp: string // Using string for simplicity, consider Date object
  contentPreview?: string // Could be message snippet or title
  read: boolean
}

// Sample data reflecting the new design
const sampleNotifications: Notification[] = [
  {
    id: 1,
    avatarUrl: "/avatars/preston.png", // Replace with actual path or URL
    avatarFallback: "PS",
    senderName: "Preston S",
    role: "following",
    action: "new post",
    timestamp: "Feb 17",
    contentPreview: "Student WINS 🙌",
    read: false,
  },
  {
    id: 2,
    avatarUrl: "/avatars/preston.png", // Replace with actual path or URL
    avatarFallback: "PS",
    senderName: "Preston S",
    role: "following",
    action: "new post",
    timestamp: "Feb 11",
    contentPreview: "Student WIN 🚀",
    read: false,
  },
  {
    id: 3,
    avatarUrl: "/avatars/shawn.png", // Replace with actual path or URL
    avatarFallback: "SM",
    senderName: "Shawn Moore",
    role: "following",
    action: "new post",
    timestamp: "Feb 10",
    contentPreview: "Private Hill Country Retreat",
    read: true,
  },
  {
    id: 4,
    avatarUrl: "/avatars/preston.png", // Replace with actual path or URL
    avatarFallback: "PS",
    senderName: "Preston S",
    role: "following",
    action: "new post",
    timestamp: "Feb 10",
    contentPreview: "Wins Post 🎖️", // Example with different emoji
    read: true,
  },
  {
    id: 5,
    avatarUrl: "/avatars/dave.png", // Replace with actual path or URL
    avatarFallback: "DS",
    senderName: "Dave Sivulich",
    role: "admin",
    action: "new post",
    timestamp: "Feb 5",
    contentPreview: "Only a few spots left! \"Set Up to Delivery the Experienc...\"",
    read: false,
  },
  {
    id: 6,
    avatarUrl: "/avatars/preston.png", // Replace with actual path or URL
    avatarFallback: "PS",
    senderName: "Preston S",
    role: "following",
    action: "new post",
    timestamp: "Feb 3",
    contentPreview: "Student WINS 🙌",
    read: true,
  },
]

// Define props for the component
interface NotificationsPopoverProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function NotificationsPopover({ open, onOpenChange }: NotificationsPopoverProps) {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [localNotifications, setLocalNotifications] = useState(sampleNotifications)
  // Simulate more notifications available
  const [hasMore, setHasMore] = useState(true)

  const unreadCount = localNotifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setLocalNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    )
  }

  const markAsRead = (id: number) => {
    setLocalNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    // Optionally open the detail view (dialog) or navigate
    setSelectedNotification(notification)
    // console.log("Notification clicked:", notification); // Or navigate, etc.
  }

  const loadMoreNotifications = () => {
    console.log("Loading more notifications...")
    // Placeholder: In a real app, fetch more data here and append it
    // For demonstration, we'll just simulate loading and disable the button
    setHasMore(false)
  }

  return (
    <>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className={cn("relative", open && "bg-muted")}>
            <Bell className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="end">
          <div className="flex max-h-[70vh] min-h-[300px] flex-col">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h4 className="text-lg font-semibold">Notifications</h4>
              {unreadCount > 0 && (
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-sm text-primary hover:underline"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
              {localNotifications.length === 0 ? (
                <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
                  You're all caught up!
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {localNotifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        !notification.read && "bg-accent/50"
                      )}
                    >
                      <Avatar className="mt-1 size-10">
                        <AvatarImage src={notification.avatarUrl} alt={notification.senderName} />
                        <AvatarFallback>{notification.avatarFallback}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm">
                          <span className="font-semibold text-foreground">{notification.senderName}</span>
                          {notification.role && <span className="text-muted-foreground"> ({notification.role})</span>}
                          <span className="text-muted-foreground"> {notification.action}</span>
                          <span className="text-muted-foreground"> • {notification.timestamp}</span>
                        </p>
                        {notification.contentPreview && (
                          <p className="mt-0.5 truncate text-sm text-muted-foreground">
                            {notification.contentPreview}
                          </p>
                        )}
                      </div>
                      {!notification.read && (
                        <span className="mt-1.5 size-2.5 flex-shrink-0 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {localNotifications.length > 0 && hasMore && (
              <div className="border-t border-border p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground"
                  onClick={loadMoreNotifications}
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedNotification?.senderName} {selectedNotification?.action}</DialogTitle>
            <DialogDescription>
              {selectedNotification?.timestamp}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              {selectedNotification?.contentPreview || "No details available."}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 