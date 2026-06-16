import { createClient } from '@/lib/supabase/server'
import { clientsDb } from '@/lib/db'
import { ClientsView } from '@/components/dashboard/clients/clients-view'

export default async function ClientsPage() {
  const supabase = await createClient()
  const clients = await clientsDb.getAll(supabase)
  return <ClientsView clients={clients} />
}
