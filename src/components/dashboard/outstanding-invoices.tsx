import Link from 'next/link'
import { FileText, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAvatar } from '@/lib/avatar'
import { getEscalationTone } from '@/lib/escalation'
import { buttonVariants } from '@/components/ui/button'
import type { InvoiceWithClient } from '@/types'

interface OutstandingInvoicesWidgetProps {
  invoices: InvoiceWithClient[]
  monthlyPaid: number
  outstandingTotal: number
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function dueDateLabel(invoice: InvoiceWithClient): string {
  const tone = getEscalationTone(invoice)
  if (tone.daysOverdue > 0) {
    return tone.daysOverdue === 1
      ? '1 day overdue'
      : `${tone.daysOverdue} days overdue`
  }
  if (tone.daysOverdue < 0) {
    const d = Math.abs(tone.daysOverdue)
    return d === 1 ? 'Due tomorrow' : `Due in ${d} days`
  }
  return 'Due today'
}

export function OutstandingInvoicesWidget({
  invoices,
  monthlyPaid,
  outstandingTotal,
}: OutstandingInvoicesWidgetProps) {
  const pendingCount = invoices.length
  const total = monthlyPaid + outstandingTotal
  const collectionRate = total > 0 ? Math.round((monthlyPaid / total) * 100) : 0

  return (
    <div className="bg-card border-border flex flex-col rounded-xl border">
      {/* Header */}
      <div className="border-border flex items-center gap-3 border-b px-4 py-3 sm:px-6 sm:py-4">
        <h2 className="text-foreground min-w-0 flex-1 font-semibold">
          Outstanding Invoices
        </h2>
        {pendingCount > 0 && (
          <span className="bg-brand/10 text-brand shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium">
            {pendingCount} pending
          </span>
        )}
        <Link
          href="/dashboard/invoices"
          className="text-muted-foreground hover:text-foreground shrink-0 text-sm transition-colors"
        >
          View all
        </Link>
      </div>

      {/* List */}
      {invoices.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <FileText className="text-muted-foreground h-5 w-5" />
          </div>
          <p className="text-foreground mb-1 text-sm font-semibold">
            All clear!
          </p>
          <p className="text-muted-foreground mb-5 text-sm">
            No outstanding invoices right now.
          </p>
          <Link
            href="/dashboard/invoices/new"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'gap-2 rounded-full',
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            New invoice
          </Link>
        </div>
      ) : (
        <ul className="divide-border divide-y">
          {invoices.map((invoice) => {
            const { initials, color } = getAvatar(invoice.client.name)
            const tone = getEscalationTone(invoice)
            return (
              <li key={invoice.id}>
                <Link
                  href={`/dashboard/invoices/${invoice.id}`}
                  className="hover:bg-muted/40 flex items-center gap-3 px-4 py-3 transition-colors sm:px-6 sm:py-3.5"
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${color}`}
                  >
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm leading-tight font-medium">
                      {invoice.client.name}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      <span className="whitespace-nowrap">
                        {invoice.number}
                      </span>
                      <span className="mx-1">·</span>
                      <span className="whitespace-nowrap">
                        {dueDateLabel(invoice)}
                      </span>
                    </p>
                  </div>

                  {/* Amount + badge */}
                  <div className="flex flex-shrink-0 flex-col items-end gap-1">
                    <span className="text-foreground text-sm font-semibold tabular-nums">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: invoice.currency,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(invoice.amount)}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tone.badgeClass}`}
                    >
                      {tone.label}
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      {/* Footer: collected this month */}
      <div className="border-border mt-auto border-t px-4 py-3 sm:px-6 sm:py-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Collected this month
          </span>
          <span className="text-foreground font-semibold tabular-nums">
            {formatCurrency(monthlyPaid)}
          </span>
        </div>
        <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
          <div
            className="bg-brand h-full rounded-full transition-all duration-500"
            style={{ width: `${collectionRate}%` }}
          />
        </div>
        <p className="text-muted-foreground mt-1.5 text-xs">
          {collectionRate}% of invoiced amount collected
        </p>
      </div>
    </div>
  )
}
