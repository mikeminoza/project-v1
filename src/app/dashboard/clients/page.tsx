import { createClient } from '@/lib/supabase/server'
import { ClientsView } from '@/components/dashboard/clients/clients-view'
import type { Client } from '@/types'

export default async function ClientsPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('clients')
    .select('*')
    .order('name', { ascending: true })

  return <ClientsView clients={(data ?? []) as Client[]} />
}
