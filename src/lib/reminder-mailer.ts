import { Resend } from 'resend'
import type {
  InvoiceWithClient,
  EmailTemplates,
  EmailTemplateLevel,
} from '@/types'
import {
  DEFAULT_TEMPLATES,
  substituteVars,
  fmtCurrency,
  fmtDate,
  getEmailContent,
  renderReminderEmail,
} from './email'
import { getEscalationTone } from './escalation'

const resend = new Resend(process.env.RESEND_API_KEY)

const TEMPLATE_LEVELS = new Set([
  'nudge',
  'follow-up',
  'firm',
  'strong',
  'final',
])

export async function sendInvoiceReminder(params: {
  invoice: InvoiceWithClient
  senderName: string
  senderEmail: string
  emailTemplates: EmailTemplates
  appUrl: string
}): Promise<{ success: boolean; emailId?: string; error?: string }> {
  const { invoice, senderName, senderEmail, emailTemplates, appUrl } = params
  const tone = getEscalationTone(invoice)

  let emailSubject: string
  let customMessage: string | undefined

  if (TEMPLATE_LEVELS.has(tone.level)) {
    const tplLevel = tone.level as EmailTemplateLevel
    const template = emailTemplates[tplLevel] ?? DEFAULT_TEMPLATES[tplLevel]
    const vars = {
      first_name: invoice.client.name.split(' ')[0],
      client_name: invoice.client.name,
      invoice_number: invoice.number,
      amount: fmtCurrency(invoice.amount, invoice.currency),
      due_date: fmtDate(invoice.due_date),
    }
    emailSubject = substituteVars(template.subject, vars)
    customMessage = substituteVars(template.message, vars)
  } else {
    const { subject } = getEmailContent(
      tone.level,
      invoice.client.name,
      invoice.number,
    )
    emailSubject = subject
  }

  const portalUrl =
    appUrl && invoice.portal_token
      ? `${appUrl}/pay/${invoice.portal_token}`
      : undefined

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
    customMessage,
    portalUrl,
  })

  const { data, error } = await resend.emails.send({
    from: 'Invoq <onboarding@resend.dev>',
    to: invoice.client.email,
    replyTo: senderEmail || undefined,
    subject: emailSubject,
    html,
  })

  if (error) return { success: false, error: error.message }
  return { success: true, emailId: data?.id }
}
