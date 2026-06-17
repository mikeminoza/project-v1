import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserProfile } from '@/types'

type ProfilePayload = Pick<
  UserProfile,
  | 'full_name'
  | 'avatar_url'
  | 'business_name'
  | 'business_address'
  | 'business_phone'
  | 'business_website'
  | 'tax_id'
  | 'logo_url'
  | 'default_payment_details'
>

async function getById(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data as UserProfile | null
}

async function update(
  supabase: SupabaseClient,
  userId: string,
  payload: Partial<ProfilePayload>,
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data as UserProfile
}

export const profilesDb = { getById, update }
