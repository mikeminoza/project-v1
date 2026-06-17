import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { invoicesDb, clientsDb, profilesDb } from '@/lib/db'
import { InvoiceEditor } from '@/components/dashboard/invoices/invoice-editor'

export default async function NewInvoicePage() {
  const supabase = await createClient()
  const [
    clients,
    nextNumber,
    {
      data: { user },
    },
  ] = await Promise.all([
    clientsDb.getAll(supabase),
    invoicesDb.getNextNumber(supabase),
    supabase.auth.getUser(),
  ])
  if (!user) redirect('/sign-in')

  const profile = await profilesDb.getById(supabase, user.id)

  return (
    <InvoiceEditor
      clients={clients}
      nextNumber={nextNumber}
      userEmail={user.email!}
      userName={user.user_metadata?.full_name as string | undefined}
      userProfile={profile}
    />
  )
}
