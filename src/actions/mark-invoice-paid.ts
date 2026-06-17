'use server'

import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'
import { invoicesDb } from '@/lib/db'
import { renderPaymentNotificationEmail } from '@/lib/email'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function markInvoicePaidAction(
  portalToken: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()
    const invoice = await invoicesDb.getByPortalToken(supabase, portalToken)

    if (!invoice) return { success: false, error: 'Invoice not found' }
    if (invoice.status === 'paid')
      return { success: false, error: 'already_paid' }
    if (invoice.status === 'draft')
      return { success: false, error: 'Invoice is not yet finalized' }

    await supabase
      .from('invoices')
      .update({ status: 'paid' })
      .eq('portal_token', portalToken)

    const freelancerEmail = invoice.profile?.email
    if (freelancerEmail) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
      const invoiceUrl = appUrl
        ? `${appUrl}/dashboard/invoices/${invoice.id}`
        : ''
      const { subject, html } = renderPaymentNotificationEmail({
        clientName: invoice.client.name,
        invoiceNumber: invoice.number,
        amount: invoice.amount,
        currency: invoice.currency,
        invoiceUrl,
      })
      await resend.emails.send({
        from: 'Invoq <onboarding@resend.dev>',
        to: freelancerEmail,
        subject,
        html,
      })
    }

    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Something went wrong',
    }
  }
}
