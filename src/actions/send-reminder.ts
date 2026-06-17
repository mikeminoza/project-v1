'use server'

import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { invoicesDb, remindersDb } from '@/lib/db'
import { getEscalationTone } from '@/lib/escalation'
import { getEmailContent, renderReminderEmail } from '@/lib/email'

const resend = new Resend(process.env.RESEND_API_KEY)

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
      supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    ])

    if (!invoice) return { success: false, error: 'Invoice not found' }
    if (invoice.status === 'paid' || invoice.status === 'draft') {
      return {
        success: false,
        error: 'Reminders can only be sent for pending or overdue invoices',
      }
    }

    const tone = getEscalationTone(invoice)
    const senderName = profile?.full_name || user.email!
    const from = 'onboarding@resend.dev'
    const { subject } = getEmailContent(
      tone.level,
      invoice.client.name,
      invoice.number,
    )

    const html = renderReminderEmail({
      clientName: invoice.client.name,
      invoiceNumber: invoice.number,
      amount: invoice.amount,
      currency: invoice.currency,
      dueDate: invoice.due_date,
      issueDate: invoice.issue_date,
      senderName,
      tone,
      notes: invoice.notes,
      lineItems: invoice.line_items,
    })

    const { error: emailError } = await resend.emails.send({
      from: `Invoq <${from}>`,
      to: invoice.client.email,
      // Replies go back to the freelancer, not the Invoq sender address
      replyTo: user.email!,
      subject,
      html,
    })

    if (emailError) return { success: false, error: emailError.message }

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
    })

    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to send reminder',
    }
  }
}
