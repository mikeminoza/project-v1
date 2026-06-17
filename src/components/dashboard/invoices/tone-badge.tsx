'use client'

import { Info } from 'lucide-react'
import { getEscalationTone } from '@/lib/escalation'
import type { InvoiceWithClient } from '@/types'

export function ToneBadge({ invoice }: { invoice: InvoiceWithClient }) {
  const tone = getEscalationTone(invoice)
  return (
    <div className="group relative inline-flex">
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${tone.badgeClass}`}
      >
        {tone.label}
      </span>
      {/* Hover tooltip showing the actionable hint */}
      <div className="bg-popover text-popover-foreground ring-foreground/10 pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-48 -translate-x-1/2 rounded-lg p-2 text-xs opacity-0 shadow-md ring-1 transition-opacity group-hover:opacity-100">
        <div className="flex items-start gap-1.5">
          <Info className="text-muted-foreground mt-0.5 h-3 w-3 flex-shrink-0" />
          <span>{tone.hint}</span>
        </div>
        {/* Arrow */}
        <div className="border-t-popover absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent" />
      </div>
    </div>
  )
}
