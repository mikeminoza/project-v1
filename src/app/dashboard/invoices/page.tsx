import { createClient } from '@/lib/supabase/server'
import { invoicesDb } from '@/lib/db'
import { InvoicesView } from '@/components/dashboard/invoices/invoices-view'

export default async function InvoicesPage() {
  const supabase = await createClient()
  const invoices = await invoicesDb.getAll(supabase)
  return <InvoicesView invoices={invoices} />
}
