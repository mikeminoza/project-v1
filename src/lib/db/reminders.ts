import type { SupabaseClient } from '@supabase/supabase-js'
import type { Reminder, ReminderSettings } from '@/types'

type ReminderPayload = Pick<
  Reminder,
  'invoice_id' | 'trigger' | 'days_offset'
> & {
  tone_level?: string | null
}

async function getByInvoice(
  supabase: SupabaseClient,
  invoiceId: string,
): Promise<Reminder[]> {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('created_at')
  if (error) throw error
  return (data ?? []) as Reminder[]
}

async function create(
  supabase: SupabaseClient,
  payload: ReminderPayload,
): Promise<Reminder> {
  const { data, error } = await supabase
    .from('reminders')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data as Reminder
}

async function createSent(
  supabase: SupabaseClient,
  payload: ReminderPayload,
): Promise<Reminder> {
  const { data, error } = await supabase
    .from('reminders')
    .insert({ ...payload, sent_at: new Date().toISOString() })
    .select()
    .single()
  if (error) throw error
  return data as Reminder
}

async function getLastByInvoice(
  supabase: SupabaseClient,
  invoiceId: string,
): Promise<Reminder | null> {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('invoice_id', invoiceId)
    .not('sent_at', 'is', null)
    .order('sent_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data as Reminder | null
}

async function markSent(
  supabase: SupabaseClient,
  id: string,
): Promise<Reminder> {
  const { data, error } = await supabase
    .from('reminders')
    .update({ sent_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Reminder
}

async function remove(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from('reminders').delete().eq('id', id)
  if (error) throw error
}

async function getSettings(
  supabase: SupabaseClient,
  userId: string,
): Promise<ReminderSettings | null> {
  const { data, error } = await supabase
    .from('reminder_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data as ReminderSettings | null
}

async function updateSettings(
  supabase: SupabaseClient,
  userId: string,
  payload: Partial<ReminderSettings>,
): Promise<ReminderSettings> {
  const { data, error } = await supabase
    .from('reminder_settings')
    .update(payload)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw error
  return data as ReminderSettings
}

export const remindersDb = {
  getByInvoice,
  getLastByInvoice,
  create,
  createSent,
  markSent,
  remove,
  getSettings,
  updateSettings,
}
