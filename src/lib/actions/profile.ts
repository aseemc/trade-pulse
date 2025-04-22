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