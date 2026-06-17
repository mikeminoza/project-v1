export type EscalationLevel =
  | 'draft'
  | 'paid'
  | 'upcoming'
  | 'due-today'
  | 'nudge'
  | 'follow-up'
  | 'firm'
  | 'strong'
  | 'final'

export interface EscalationTone {
  level: EscalationLevel
  label: string
  hint: string
  badgeClass: string
  daysOverdue: number
}

export function getEscalationTone(invoice: {
  status: string
  due_date: string
}): EscalationTone {
  if (invoice.status === 'paid') {
    return {
      level: 'paid',
      label: 'Paid',
      hint: 'Invoice has been settled.',
      badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
      daysOverdue: 0,
    }
  }

  if (invoice.status === 'draft') {
    return {
      level: 'draft',
      label: 'Draft',
      hint: 'Not yet sent to client.',
      badgeClass: 'bg-muted text-muted-foreground',
      daysOverdue: 0,
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(invoice.due_date)
  due.setHours(0, 0, 0, 0)
  const daysOverdue = Math.round(
    (today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24),
  )

  if (daysOverdue < 0) {
    const daysLeft = Math.abs(daysOverdue)
    return {
      level: 'upcoming',
      label: `Due in ${daysLeft}d`,
      hint: `Due ${daysLeft === 1 ? 'tomorrow' : `in ${daysLeft} days`} — no action needed yet.`,
      badgeClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
      daysOverdue,
    }
  }

  if (daysOverdue === 0) {
    return {
      level: 'due-today',
      label: 'Due today',
      hint: 'Send a friendly payment reminder today.',
      badgeClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
      daysOverdue: 0,
    }
  }

  if (daysOverdue <= 3) {
    return {
      level: 'nudge',
      label: 'Gentle nudge',
      hint: `${daysOverdue}d overdue — keep it light and friendly.`,
      badgeClass: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
      daysOverdue,
    }
  }

  if (daysOverdue <= 7) {
    return {
      level: 'follow-up',
      label: 'Follow up',
      hint: `${daysOverdue}d overdue — polite but clearly direct.`,
      badgeClass: 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
      daysOverdue,
    }
  }

  if (daysOverdue <= 14) {
    return {
      level: 'firm',
      label: 'Firm follow-up',
      hint: `${daysOverdue}d overdue — be firm and set a deadline.`,
      badgeClass: 'bg-orange-600/15 text-orange-800 dark:text-orange-300',
      daysOverdue,
    }
  }

  if (daysOverdue <= 30) {
    return {
      level: 'strong',
      label: 'Strong follow-up',
      hint: `${daysOverdue}d overdue — escalate with urgency.`,
      badgeClass: 'bg-red-500/15 text-red-700 dark:text-red-400',
      daysOverdue,
    }
  }

  return {
    level: 'final',
    label: 'Final notice',
    hint: `${daysOverdue}d overdue — last chance before further action.`,
    badgeClass: 'bg-red-600/20 text-red-800 dark:text-red-300',
    daysOverdue,
  }
}
