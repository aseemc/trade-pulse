import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { BillingSettingsView } from "@/components/billing-settings-view"

export function AccountSettingsView() {
  return (
    <Card className="w-full max-w-none">
      <CardHeader>
        <CardTitle>Plans & Billing</CardTitle>
        <CardDescription>Manage your subscription and billing information.</CardDescription>
      </CardHeader>
      <CardContent>
        <BillingSettingsView />
      </CardContent>
    </Card>
  )
} 