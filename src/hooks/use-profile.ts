import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

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
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          throw new Error('No session found')
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        if (error) throw error
        setProfile(data)
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