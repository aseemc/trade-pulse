import { useEffect, useState } from 'react'
import { getProfile } from '@/lib/actions/profile'

export interface UserProfile {
  id: number
  user_id: string
  first_name: string
  last_name: string
  email: string
  avatar: string | null
  username: string
  dob: string | null
}

export function useProfile(refetchTrigger = 0) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const result = await getProfile()
        if (result.error) {
          throw new Error(result.error)
        }
        setProfile(result.data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch profile'))
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [refetchTrigger])

  return { profile, loading, error }
} 