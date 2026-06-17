'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { profilesDb } from '@/lib/db'

export async function updateProfileAction(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const str = (key: string) =>
      (formData.get(key) as string | null)?.trim() || null

    // Logo URL is uploaded client-side to Supabase Storage and passed back as a string.
    // Removal is signaled by 'remove_logo' = 'true'.
    const logoUrl = str('logo_url')
    const removeLogoFlag = formData.get('remove_logo') === 'true'

    const payload: Record<string, string | null> = {
      full_name: str('full_name'),
      business_name: str('business_name'),
      business_address: str('business_address'),
      business_phone: str('business_phone'),
      business_website: str('business_website'),
      tax_id: str('tax_id'),
      default_payment_details: str('default_payment_details'),
    }

    if (logoUrl) {
      payload.logo_url = logoUrl
    } else if (removeLogoFlag) {
      payload.logo_url = null
    }

    await profilesDb.update(supabase, user.id, payload)
    revalidatePath('/dashboard/settings')
    revalidatePath('/dashboard/invoices/new')
    revalidatePath('/dashboard/invoices')
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update profile',
    }
  }
}
