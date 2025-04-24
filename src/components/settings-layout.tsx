"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"

import { AccountSettingsView } from "@/components/account-settings-view"
import { NotificationsSettingsForm } from "@/components/notifications-settings-form"
import { ProfileSettingsForm, type UserProfile } from "@/components/profile-settings-form"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useProfileContext } from "@/contexts/profile-context"

const sidebarNavItems = [
  { title: "Profile", key: "profile" },
  { title: "Account", key: "account" },
  { title: "Appearance", key: "appearance" },
  { title: "Notifications", key: "notifications" },
  { title: "Display", key: "display" },
]

type SettingsSection = "profile" | "account" | "appearance" | "notifications" | "display"

export function SettingsLayout() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeSection, setActiveSection] = React.useState<SettingsSection>("profile")
  const { profile, loading } = useProfileContext()

  React.useEffect(() => {
    // Get the section from URL query parameter
    const section = searchParams.get("section") as SettingsSection
    if (section && sidebarNavItems.some(item => item.key === section)) {
      setActiveSection(section)
    }
  }, [searchParams])

  const handleSectionChange = (section: SettingsSection) => {
    setActiveSection(section)
    // Clear the query parameter when switching tabs
    const url = new URL(window.location.href)
    url.searchParams.delete("section")
    router.replace(url.pathname)
  }

  const renderSection = () => {
    if (loading) {
      return <div>Loading...</div>
    }

    if (!profile) {
      return <div>No profile data available</div>
    }

    const userData: UserProfile = {
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      dob: profile.dob ? new Date(profile.dob) : undefined,
      avatarUrl: profile.avatar || undefined,
      userId: profile.user_id,
    }

    switch (activeSection) {
      case "profile":
        return <ProfileSettingsForm userData={userData} />
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
    <div className="space-y-6 p-4">
      <div className="lg:hidden">
        <Tabs value={activeSection} onValueChange={(value: string) => handleSectionChange(value as SettingsSection)} className="w-full">
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
        <aside className="w-1/6">
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
                onClick={() => handleSectionChange(item.key as SettingsSection)}
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