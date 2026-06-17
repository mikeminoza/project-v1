import type { Client } from './client'
import type { UserProfile } from './user'

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue'

export interface LineItem {
  id: string
  description: string
  quantity: number
  unit_price: number
}

export interface Invoice {
  id: string
  user_id: string
  client_id: string
  number: string
  amount: number
  line_items: LineItem[]
  currency: string
  issue_date: string
  due_date: string
  status: InvoiceStatus
  notes: string | null
  payment_details: string | null
  logo_url: string | null
  portal_token: string
  created_at: string
  updated_at: string
}

export interface InvoiceWithClient extends Invoice {
  client: Client
}

export type InvoicePortalView = InvoiceWithClient & {
  profile: UserProfile | null
}
