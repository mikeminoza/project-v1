'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { EmailTemplates } from '@/types'

export async function saveTemplatesAction(
  templates: EmailTemplates,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const { error } = await supabase
      .from('profiles')
      .update({ email_templates: templates })
      .eq('id', user.id)
    if (error) throw error

    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to save templates',
    }
  }
}
