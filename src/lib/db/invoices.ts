import type { SupabaseClient } from '@supabase/supabase-js'
import type { Invoice, InvoiceStatus, InvoiceWithClient } from '@/types'

type InvoicePayload = Pick<
  Invoice,
  | 'client_id'
  | 'number'
  | 'amount'
  | 'line_items'
  | 'currency'
  | 'issue_date'
  | 'due_date'
  | 'status'
  | 'notes'
  | 'payment_details'
  | 'logo_url'
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

async function getOutstanding(
  supabase: SupabaseClient,
  limit = 5,
): Promise<InvoiceWithClient[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, client:clients(id, name, email, company)')
    .in('status', ['pending', 'overdue'])
    .order('due_date', { ascending: true })
    .limit(limit)
  if (error) throw error
  return (data ?? []) as InvoiceWithClient[]
}

async function getMonthlyPaid(supabase: SupabaseClient): Promise<number> {
  const now = new Date()
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  ).toISOString()
  const { data, error } = await supabase
    .from('invoices')
    .select('amount')
    .eq('status', 'paid')
    .gte('updated_at', startOfMonth)
  if (error) throw error
  return (data ?? []).reduce((sum, r) => sum + Number(r.amount), 0)
}

async function getNextNumber(supabase: SupabaseClient): Promise<string> {
  const { count } = await supabase
    .from('invoices')
    .select('id', { count: 'exact', head: true })
  const next = String((count ?? 0) + 1).padStart(3, '0')
  return `INV-${next}`
}

export const invoicesDb = {
  getAll,
  getRecent,
  getById,
  getStats,
  getOutstanding,
  getMonthlyPaid,
  getNextNumber,
  create,
  update,
  remove,
}
