import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { invoicesDb, clientsDb, remindersDb, profilesDb } from '@/lib/db'
import { InvoiceEditor } from '@/components/dashboard/invoices/invoice-editor'

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const [
    invoice,
    clients,
    {
      data: { user },
    },
  ] = await Promise.all([
    invoicesDb.getById(supabase, id),
    clientsDb.getAll(supabase),
    supabase.auth.getUser(),
  ])
  if (!invoice) notFound()
  if (!user) redirect('/sign-in')

  const [lastReminder, profile] = await Promise.all([
    remindersDb.getLastByInvoice(supabase, invoice.id),
    profilesDb.getById(supabase, user.id),
  ])

  return (
    <InvoiceEditor
      invoice={invoice}
      clients={clients}
      nextNumber={invoice.number}
      userEmail={user.email!}
      userName={user.user_metadata?.full_name as string | undefined}
      userProfile={profile}
      lastReminderSentAt={lastReminder?.sent_at ?? null}
      lastReminderOpenedAt={lastReminder?.opened_at ?? null}
      lastReminderClickedAt={lastReminder?.clicked_at ?? null}
    />
  )
}
