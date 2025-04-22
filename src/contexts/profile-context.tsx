"use client"

import * as React from "react"
import { useProfile, type UserProfile } from "@/hooks/use-profile"

interface ProfileContextType {
  profile: UserProfile | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

const ProfileContext = React.createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { profile, loading, error } = useProfile()
  const [refetchTrigger, setRefetchTrigger] = React.useState(0)

  console.log('=> profile', profile, loading, error);
  
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