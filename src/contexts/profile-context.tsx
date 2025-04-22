"use client"

import * as React from "react"
import { useProfile } from "@/hooks/use-profile"

interface ProfileContextType {
  profile: {
    id: number
    user_id: string
    first_name: string
    last_name: string
    email: string
    avatar: string | null
    username: string
    dob: string | null
  } | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

const ProfileContext = React.createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [refetchTrigger, setRefetchTrigger] = React.useState(0)
  const { profile, loading, error } = useProfile(refetchTrigger)

  const refetch = React.useCallback(async () => {
    setRefetchTrigger(prev => prev + 1)
  }, [])

  const value = React.useMemo(
    () => ({
      profile,
      loading,
      error,
      refetch,
    }),
    [profile, loading, error, refetch]
  )

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfileContext() {
  const context = React.useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfileContext must be used within a ProfileProvider")
  }
  return context
} 