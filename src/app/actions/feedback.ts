'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function submitFeedback(formData: { subject: string; message: string }) {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { error: 'Not authenticated' }
    }

    const { error } = await supabase
      .from('feedbacks')
      .insert({
        subject: formData.subject,
        message: formData.message,
        user_id: user.id
      })

    if (error) {
      console.error('Error submitting feedback:', error)
      return { error: 'Failed to submit feedback' }
    }

    revalidatePath('/feedback')
    return { success: true }
  } catch (error) {
    console.error('Error in submitFeedback:', error)
    return { error: 'An unexpected error occurred' }
  }
} 