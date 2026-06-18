'use server'

import { createClient } from '@/lib/supabase/server'
import { invoicesDb, remindersDb } from '@/lib/db'
import { getEscalationTone } from '@/lib/escalation'
import { sendInvoiceReminder } from '@/lib/reminder-mailer'
import type { EmailTemplates } from '@/types'

export async function sendReminderAction(
  invoiceId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const [invoice, { data: profile }] = await Promise.all([
      invoicesDb.getById(supabase, invoiceId),
      supabase
        .from('profiles')
        .select('full_name, email, email_templates')
        .eq('id', user.id)
        .single(),
    ])

    if (!invoice) return { success: false, error: 'Invoice not found' }
    if (invoice.status === 'paid' || invoice.status === 'draft') {
      return {
        success: false,
        error: 'Reminders can only be sent for pending or overdue invoices',
      }
    }

    const tone = getEscalationTone(invoice)
    const result = await sendInvoiceReminder({
      invoice,
      senderName: profile?.full_name || user.email!,
      senderEmail: user.email!,
      emailTemplates: (profile?.email_templates as EmailTemplates) ?? {},
      appUrl: process.env.NEXT_PUBLIC_APP_URL ?? '',
    })

    if (!result.success) return result

    const trigger =
      tone.daysOverdue < 0
        ? ('before_due' as const)
        : tone.daysOverdue === 0
          ? ('on_due' as const)
          : ('after_due' as const)

    await remindersDb.createSent(supabase, {
      invoice_id: invoiceId,
      trigger,
      days_offset: tone.daysOverdue,
      tone_level: tone.level,
    })

    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to send reminder',
    }
  }
}
