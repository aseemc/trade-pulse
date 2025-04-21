import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export function AccountSettingsView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account details (coming soon).</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This section is under construction. You&apos;ll soon be able to manage login methods, security settings, and more.
        </p>
      </CardContent>
    </Card>
  )
} 