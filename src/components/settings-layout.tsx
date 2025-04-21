"use client"

import * as React from "react"

import { AccountSettingsView } from "@/components/account-settings-view"
import { NotificationsSettingsForm } from "@/components/notifications-settings-form"
import { ProfileSettingsForm } from "@/components/profile-settings-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Sample user data for profile prefill - replace with actual data source
const sampleUserData = {
  firstName: "shadcn",
  lastName: "UI",
  avatarUrl: "/avatars/shadcn.jpg", // Make sure this path exists in your public folder or is a valid URL
  dob: new Date("1990-05-15"),
}

const sidebarNavItems = [
  { title: "Profile", key: "profile" },
  { title: "Account", key: "account" },
  { title: "Notifications", key: "notifications" },
]

type SettingsSection = "profile" | "account" | "notifications"

export function SettingsLayout() {
  const [activeSection, setActiveSection] = React.useState<SettingsSection>("profile")

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSettingsForm userData={sampleUserData} />
      case "account":
        return <AccountSettingsView />
      case "notifications":
        return <NotificationsSettingsForm />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 px-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and notification preferences.
        </p>
      </div>
      <Separator />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 gap-4">
        <aside className="-mx-4 lg:w-1/5 lg:mx-0">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.key}
                variant="ghost"
                className={cn(
                  "w-full justify-start cursor-pointer",
                  activeSection === item.key
                    ? "bg-muted hover:bg-muted"
                    : "hover:bg-muted"
                )}
                onClick={() => setActiveSection(item.key as SettingsSection)}
              >
                {item.title}
              </Button>
            ))}
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-2xl">{renderSection()}</div>
      </div>
    </div>
  )
} 