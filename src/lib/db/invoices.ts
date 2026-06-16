import type { SupabaseClient } from '@supabase/supabase-js'
import type { Invoice, InvoiceStatus, InvoiceWithClient } from '@/types'

type InvoicePayload = Pick<
  Invoice,
  | 'client_id'
  | 'number'
  | 'amount'
  | 'currency'
  | 'issue_date'
  | 'due_date'
  | 'status'
  | 'notes'
>

export interface InvoiceStats {
  total: number
  outstanding: number
  paid: number
  overdue: number
}

async function getAll(
  supabase: SupabaseClient,
  filters?: { status?: InvoiceStatus },
): Promise<InvoiceWithClient[]> {
  let query = supabase
    .from('invoices')
    .select('*, client:clients(*)')
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as InvoiceWithClient[]
}

async function getRecent(
  supabase: SupabaseClient,
  limit = 5,
): Promise<InvoiceWithClient[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, client:clients(id, name, email, company)')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []) as InvoiceWithClient[]
}

async function getById(
  supabase: SupabaseClient,
  id: string,
): Promise<InvoiceWithClient | null> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, client:clients(*)')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as InvoiceWithClient | null
}

async function getStats(supabase: SupabaseClient): Promise<InvoiceStats> {
  const { data, error } = await supabase
    .from('invoices')
    .select('status, amount')
  if (error) throw error

  const rows = data ?? []
  return {
    total: rows.length,
    outstanding: rows
      .filter((r) => r.status === 'pending')
      .reduce((sum, r) => sum + Number(r.amount), 0),
    paid: rows
      .filter((r) => r.status === 'paid')
      .reduce((sum, r) => sum + Number(r.amount), 0),
    overdue: rows.filter((r) => r.status === 'overdue').length,
  }
}

async function create(
  supabase: SupabaseClient,
  userId: string,
  payload: InvoicePayload,
): Promise<Invoice> {
  const { data, error } = await supabase
    .from('invoices')
    .insert({ ...payload, user_id: userId })
    .select()
    .single()
  if (error) throw error
  return data as Invoice
}

async function update(
  supabase: SupabaseClient,
  id: string,
  payload: Partial<InvoicePayload>,
): Promise<Invoice> {
  const { data, error } = await supabase
    .from('invoices')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Invoice
}

async function remove(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from('invoices').delete().eq('id', id)
  if (error) throw error
}

export const invoicesDb = {
  getAll,
  getRecent,
  getById,
  getStats,
  create,
  update,
  remove,
}
