import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  Invoice,
  InvoicePortalView,
  InvoiceStatus,
  InvoiceWithClient,
  UserProfile,
} from '@/types'

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
  | 'auto_reminder'
>

export interface InvoiceStats {
  total: number
  outstanding: number
  paid: number
  overdue: number
}

export interface MonthlyRevenue {
  month: string
  key: string
  paid: number
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

async function getByClient(
  supabase: SupabaseClient,
  clientId: string,
): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Invoice[]
}

async function getMonthlyRevenue(
  supabase: SupabaseClient,
  months = 6,
): Promise<MonthlyRevenue[]> {
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - (months - 1))
  cutoff.setDate(1)
  cutoff.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('invoices')
    .select('amount, updated_at')
    .eq('status', 'paid')
    .gte('updated_at', cutoff.toISOString())

  if (error) throw error

  const map: Record<string, number> = {}
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    map[key] = 0
  }

  for (const row of data ?? []) {
    const d = new Date(row.updated_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (key in map) map[key] = (map[key] ?? 0) + Number(row.amount)
  }

  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, paid]) => {
      const [year, month] = key.split('-')
      const label = new Date(
        Number(year),
        Number(month) - 1,
      ).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      return { month: label, key, paid }
    })
}

async function getOverdueInvoices(
  supabase: SupabaseClient,
): Promise<InvoiceWithClient[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { data, error } = await supabase
    .from('invoices')
    .select('*, client:clients(id, name, email, company)')
    .in('status', ['pending', 'overdue'])
    .lt('due_date', today.toISOString().split('T')[0])
    .order('due_date', { ascending: true })
  if (error) throw error
  return (data ?? []) as InvoiceWithClient[]
}

async function getNextNumber(supabase: SupabaseClient): Promise<string> {
  const { count } = await supabase
    .from('invoices')
    .select('id', { count: 'exact', head: true })
  const next = String((count ?? 0) + 1).padStart(3, '0')
  return `INV-${next}`
}

async function getByPortalToken(
  supabase: SupabaseClient,
  token: string,
): Promise<InvoicePortalView | null> {
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*, client:clients(*)')
    .eq('portal_token', token)
    .maybeSingle()
  if (error) throw error
  if (!invoice) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', invoice.user_id)
    .maybeSingle()

  return {
    ...(invoice as InvoiceWithClient),
    profile: profile as UserProfile | null,
  } as InvoicePortalView
}

export const invoicesDb = {
  getAll,
  getRecent,
  getById,
  getByClient,
  getByPortalToken,
  getStats,
  getOutstanding,
  getMonthlyPaid,
  getMonthlyRevenue,
  getOverdueInvoices,
  getNextNumber,
  create,
  update,
  remove,
}
