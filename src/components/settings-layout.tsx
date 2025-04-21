"use client"

import * as React from "react"

import { AccountSettingsView } from "@/components/account-settings-view"
import { NotificationsSettingsForm } from "@/components/notifications-settings-form"
import { ProfileSettingsForm, type UserProfile } from "@/components/profile-settings-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Sample user data for profile prefill - replace with actual data source
const sampleUserData: UserProfile = {
  firstName: "shadcn",
  lastName: "UI",
  email: "m@example.com",
  avatarUrl: "/avatars/shadcn.jpg", // Make sure this path exists in your public folder or is a valid URL
  dob: new Date("1990-05-15"),
}

const sidebarNavItems = [
  { title: "Profile", key: "profile" },
  { title: "Account", key: "account" },
  { title: "Appearance", key: "appearance" },
  { title: "Notifications", key: "notifications" },
  { title: "Display", key: "display" },
]

type SettingsSection = "profile" | "account" | "appearance" | "notifications" | "display"

export function SettingsLayout() {
  const [activeSection, setActiveSection] = React.useState<SettingsSection>("profile")

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSettingsForm userData={sampleUserData} />
      case "account":
        return <AccountSettingsView />
      case "appearance":
        return <div>Appearance Settings Placeholder</div>
      case "notifications":
        return <NotificationsSettingsForm />
      case "display":
        return <div>Display Settings Placeholder</div>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and notification preferences.
        </p>
      </div>
      <Separator />
      
      <div className="lg:hidden">
        <Tabs value={activeSection} onValueChange={(value: string) => setActiveSection(value as SettingsSection)} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {sidebarNavItems.map((item) => (
              <TabsTrigger key={item.key} value={item.key}>
                {item.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="mt-6">
          {renderSection()}
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-row lg:space-x-12">
        <aside className="w-1/5">
          <nav className="flex flex-col space-y-1">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.key}
                variant="ghost"
                className={cn(
                  "w-full justify-start cursor-pointer",
                  activeSection === item.key
                    ? "bg-muted hover:bg-muted"
                    : "hover:bg-transparent",
                  "hover:underline"
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