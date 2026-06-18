import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getEscalationTone } from '@/lib/escalation'
import { sendInvoiceReminder } from '@/lib/reminder-mailer'
import type { InvoiceWithClient, EmailTemplates } from '@/types'

export const dynamic = 'force-dynamic'

const SENDABLE_LEVELS = new Set([
  'upcoming',
  'due-today',
  'nudge',
  'follow-up',
  'firm',
  'strong',
  'final',
])

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const results = await runAutoReminders()
    return NextResponse.json({ ok: true, ...results })
  } catch (err) {
    console.error('[cron/reminders]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

async function runAutoReminders() {
  const supabase = createAdminClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('*, client:clients(*)')
    .in('status', ['pending', 'overdue'])
    .eq('auto_reminder', true)

  if (error) throw error

  let sent = 0
  let skipped = 0
  let errors = 0
  const log: string[] = []

  for (const invoice of (invoices ?? []) as InvoiceWithClient[]) {
    try {
      const tone = getEscalationTone(invoice)

      if (!SENDABLE_LEVELS.has(tone.level)) {
        skipped++
        continue
      }

      // Check if we already sent at this exact tone level
      const { data: last } = await supabase
        .from('reminders')
        .select('tone_level')
        .eq('invoice_id', invoice.id)
        .not('sent_at', 'is', null)
        .order('sent_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (last?.tone_level === tone.level) {
        skipped++
        continue
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email, email_templates')
        .eq('id', invoice.user_id)
        .maybeSingle()

      const result = await sendInvoiceReminder({
        invoice,
        senderName: profile?.full_name || profile?.email || 'Invoq',
        senderEmail: profile?.email ?? '',
        emailTemplates: (profile?.email_templates as EmailTemplates) ?? {},
        appUrl,
      })

      if (!result.success) {
        errors++
        log.push(`ERROR ${invoice.number}: ${result.error}`)
        continue
      }

      const trigger =
        tone.daysOverdue < 0
          ? 'before_due'
          : tone.daysOverdue === 0
            ? 'on_due'
            : 'after_due'

      await supabase.from('reminders').insert({
        invoice_id: invoice.id,
        trigger,
        days_offset: tone.daysOverdue,
        sent_at: new Date().toISOString(),
        tone_level: tone.level,
        resend_email_id: result.emailId ?? null,
      })

      sent++
      log.push(`SENT ${invoice.number} → ${tone.level}`)
    } catch (err) {
      errors++
      log.push(
        `ERROR ${(invoice as { number?: string }).number ?? '?'}: ${String(err)}`,
      )
    }
  }

  return { sent, skipped, errors, log }
}
