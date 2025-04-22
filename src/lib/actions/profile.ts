'use server'

import { createClient } from '@/lib/supabase/server'

export async function getProfile() {
  const supabase = await createClient()

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      return { error: userError.message }
    }
    if (!user) {
      return { error: 'No user found' }
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error('=> getProfile', error);
    return { error: 'Failed to fetch profile' }
  }
}

export async function updateProfile(data: {
  first_name: string
  last_name: string
  dob?: string | null
  avatar?: string | null
}) {
  const supabase = await createClient()

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('=> updateProfile userError:', userError)
      return { error: userError.message }
    }
    if (!user) {
      console.error('=> updateProfile: No user found')
      return { error: 'No user found' }
    }

    const { data: result, error } = await supabase
      .from('profiles')
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
        dob: data.dob,
        avatar: data.avatar,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .select()

    if (error) {
      return { error: error.message }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error('=> updateProfile error:', error)
    return { error: 'Failed to update profile' }
  }
} 