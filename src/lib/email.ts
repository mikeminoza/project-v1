import type { EscalationLevel, EscalationTone } from './escalation'
import type { LineItem } from '@/types'
import { format, parseISO } from 'date-fns'

interface ReminderEmailData {
  clientName: string
  invoiceNumber: string
  amount: number
  currency: string
  dueDate: string
  issueDate: string
  senderName: string
  tone: EscalationTone
  notes?: string | null
  lineItems?: LineItem[]
}

const ACCENT: Record<string, string> = {
  upcoming: '#3b82f6',
  'due-today': '#3b82f6',
  nudge: '#f59e0b',
  'follow-up': '#f97316',
  firm: '#ef4444',
  strong: '#dc2626',
  final: '#991b1b',
  paid: '#10b981',
  draft: '#9ca3af',
}

function getAccent(level: EscalationLevel) {
  return ACCENT[level] ?? '#6b7280'
}

type EmailContent = { subject: string; greeting: string; body: string }

export function getEmailContent(
  level: EscalationLevel,
  clientName: string,
  invoiceNumber: string,
): EmailContent {
  const first = clientName.split(' ')[0]

  switch (level) {
    case 'upcoming':
      return {
        subject: `Upcoming payment: ${invoiceNumber}`,
        greeting: `Hi ${first},`,
        body: `Just a friendly heads-up that the invoice below is coming up for payment soon. No action needed quite yet — just wanted to give you advance notice so you can plan accordingly.`,
      }
    case 'due-today':
      return {
        subject: `Invoice ${invoiceNumber} is due today`,
        greeting: `Hi ${first},`,
        body: `This is a friendly reminder that the following invoice is due today. Please let me know if you have any questions or need to discuss payment arrangements.`,
      }
    case 'nudge':
      return {
        subject: `Quick note about invoice ${invoiceNumber}`,
        greeting: `Hi ${first},`,
        body: `Hope you're doing well! I just wanted to send a quick follow-up — the invoice below was due a few days ago. Could you let me know when to expect payment? Happy to answer any questions.`,
      }
    case 'follow-up':
      return {
        subject: `Following up on invoice ${invoiceNumber}`,
        greeting: `Hi ${first},`,
        body: `I'm following up on the invoice below, which is now past its due date. I'd appreciate it if you could arrange payment at your earliest convenience, or reach out if there's anything preventing it.`,
      }
    case 'firm':
      return {
        subject: `Invoice ${invoiceNumber} — payment overdue`,
        greeting: `Dear ${clientName},`,
        body: `I'm writing regarding the outstanding invoice below, which is now significantly overdue. Please arrange payment promptly. If you have already sent payment, please disregard this notice and let me know.`,
      }
    case 'strong':
      return {
        subject: `Urgent: Invoice ${invoiceNumber} overdue`,
        greeting: `Dear ${clientName},`,
        body: `This is an urgent notice regarding your unpaid invoice, which is now considerably overdue. I need you to process payment immediately or contact me to discuss a resolution before further action is taken.`,
      }
    case 'final':
      return {
        subject: `Final notice: Invoice ${invoiceNumber}`,
        greeting: `Dear ${clientName},`,
        body: `This is a final notice regarding your outstanding invoice. Despite previous reminders, payment has not been received. Please settle the outstanding balance immediately. Failure to do so may result in further action to recover the amount owed.`,
      }
    default:
      return {
        subject: `Payment reminder: ${invoiceNumber}`,
        greeting: `Hi ${first},`,
        body: `This is a reminder about the following invoice.`,
      }
  }
}

function fmtCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

function fmtDate(dateStr: string) {
  try {
    return format(parseISO(dateStr), 'MMMM d, yyyy')
  } catch {
    return dateStr
  }
}

export function renderReminderEmail(data: ReminderEmailData): string {
  const {
    clientName,
    invoiceNumber,
    amount,
    currency,
    dueDate,
    issueDate,
    senderName,
    tone,
    notes,
    lineItems,
  } = data
  const accent = getAccent(tone.level)
  const { greeting, body } = getEmailContent(
    tone.level,
    clientName,
    invoiceNumber,
  )

  const lineItemRows =
    lineItems && lineItems.length > 0
      ? lineItems
          .map(
            (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#374151;">${item.description || '—'}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#6b7280;text-align:right;">${item.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#6b7280;text-align:right;">${fmtCurrency(item.unit_price, currency)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#374151;text-align:right;">${fmtCurrency(item.quantity * item.unit_price, currency)}</td>
      </tr>`,
          )
          .join('')
      : ''

  const lineItemsSection =
    lineItems && lineItems.length > 0
      ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
          <thead>
            <tr>
              <th style="text-align:left;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em;padding-bottom:8px;border-bottom:1px solid #e5e7eb;">Description</th>
              <th style="text-align:right;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em;padding-bottom:8px;border-bottom:1px solid #e5e7eb;">Qty</th>
              <th style="text-align:right;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em;padding-bottom:8px;border-bottom:1px solid #e5e7eb;">Unit price</th>
              <th style="text-align:right;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em;padding-bottom:8px;border-bottom:1px solid #e5e7eb;">Amount</th>
            </tr>
          </thead>
          <tbody>${lineItemRows}</tbody>
        </table>`
      : ''

  const notesSection = notes?.trim()
    ? `<div style="margin:0 0 24px;padding:16px;background:#fffbeb;border-left:3px solid #fbbf24;border-radius:0 6px 6px 0;">
        <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af;">Notes</p>
        <p style="margin:0;font-size:13px;color:#374151;white-space:pre-wrap;">${notes}</p>
       </div>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Invoice ${invoiceNumber}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">

          <!-- Accent bar -->
          <tr><td style="height:4px;background:${accent};font-size:0;">&nbsp;</td></tr>

          <!-- Header -->
          <tr>
            <td style="padding:36px 40px 0;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;">Invoice</p>
              <p style="margin:0;font-family:'Courier New',monospace;font-size:22px;font-weight:700;color:#111827;">${invoiceNumber}</p>
            </td>
          </tr>

          <!-- Greeting + body -->
          <tr>
            <td style="padding:24px 40px;">
              <p style="margin:0 0 12px;font-size:15px;color:#111827;">${greeting}</p>
              <p style="margin:0;font-size:15px;color:#374151;line-height:1.6;">${body}</p>
            </td>
          </tr>

          <!-- Invoice details box -->
          <tr>
            <td style="padding:0 40px 32px;">
              <div style="background:#f9fafb;border-radius:8px;padding:20px 24px;">

                ${lineItemsSection}

                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:13px;color:#6b7280;padding-bottom:8px;">Invoice #</td>
                    <td style="font-size:13px;color:#374151;font-weight:500;text-align:right;padding-bottom:8px;">${invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td style="font-size:13px;color:#6b7280;padding-bottom:8px;">Issue date</td>
                    <td style="font-size:13px;color:#374151;font-weight:500;text-align:right;padding-bottom:8px;">${fmtDate(issueDate)}</td>
                  </tr>
                  <tr>
                    <td style="font-size:13px;color:#6b7280;padding-bottom:12px;">Due date</td>
                    <td style="font-size:13px;color:#374151;font-weight:500;text-align:right;padding-bottom:12px;">${fmtDate(dueDate)}</td>
                  </tr>
                  <tr>
                    <td style="font-size:16px;font-weight:700;color:#111827;padding-top:12px;border-top:1px solid #e5e7eb;">Amount due</td>
                    <td style="font-size:16px;font-weight:700;color:${accent};text-align:right;padding-top:12px;border-top:1px solid #e5e7eb;">${fmtCurrency(amount, currency)}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          ${notesSection ? `<tr><td style="padding:0 40px 24px;">${notesSection}</td></tr>` : ''}

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Sent by <strong style="color:#6b7280;">${senderName}</strong> · Powered by Invoq
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
