import type { Client } from './client'

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue'

export interface Invoice {
  id: string
  user_id: string
  client_id: string
  number: string
  amount: number
  currency: string
  issue_date: string
  due_date: string
  status: InvoiceStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface InvoiceWithClient extends Invoice {
  client: Client
}
