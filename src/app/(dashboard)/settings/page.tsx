import { Suspense } from "react"
import { SettingsLayout } from "@/components/settings-layout"

export default function SettingsPage() {
  return (
    <div className="">
      <Suspense fallback={<div>Loading settings...</div>}>
        <SettingsLayout />
      </Suspense>
    </div>
  )
} 