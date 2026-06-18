import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { clientsDb, invoicesDb } from '@/lib/db'
import { ClientDetail } from '@/components/dashboard/clients/client-detail'

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [client, invoices] = await Promise.all([
    clientsDb.getById(supabase, id),
    invoicesDb.getByClient(supabase, id),
  ])

  if (!client) notFound()

  return <ClientDetail client={client} invoices={invoices} />
}
