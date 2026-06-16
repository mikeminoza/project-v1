import type { SupabaseClient } from '@supabase/supabase-js'
import type { Client } from '@/types'

type ClientPayload = Pick<
  Client,
  'name' | 'email' | 'phone' | 'company' | 'address'
>

async function getAll(supabase: SupabaseClient): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('name')
  if (error) throw error
  return (data ?? []) as Client[]
}

async function getRecent(
  supabase: SupabaseClient,
  limit = 5,
): Promise<Pick<Client, 'id' | 'name' | 'email' | 'company'>[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('id, name, email, company')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []) as Pick<Client, 'id' | 'name' | 'email' | 'company'>[]
}

async function getById(
  supabase: SupabaseClient,
  id: string,
): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as Client | null
}

async function create(
  supabase: SupabaseClient,
  userId: string,
  payload: ClientPayload,
): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .insert({ ...payload, user_id: userId })
    .select()
    .single()
  if (error) throw error
  return data as Client
}

async function update(
  supabase: SupabaseClient,
  id: string,
  payload: Partial<ClientPayload>,
): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Client
}

async function remove(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from('clients').delete().eq('id', id)
  if (error) throw error
}

export const clientsDb = { getAll, getRecent, getById, create, update, remove }
