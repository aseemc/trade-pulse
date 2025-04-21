import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="bg-card rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p className="text-muted-foreground">
          Configure your application settings and preferences.
        </p>
      </div>
    </div>
  )
} 