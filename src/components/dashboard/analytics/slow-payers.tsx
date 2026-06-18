import Link from 'next/link'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { getAvatar } from '@/lib/avatar'
import { getEscalationTone } from '@/lib/escalation'
import type { InvoiceWithClient } from '@/types'

interface Props {
  invoices: InvoiceWithClient[]
}

function fmtCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function SlowPayers({ invoices }: Props) {
  return (
    <div className="bg-card border-border rounded-xl border">
      <div className="border-border flex items-center justify-between border-b px-6 py-4">
        <div>
          <h2 className="text-foreground font-semibold">Slow Payers</h2>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {invoices.length === 0
              ? 'No overdue invoices'
              : `${invoices.length} overdue invoice${invoices.length === 1 ? '' : 's'}`}
          </p>
        </div>
        {invoices.length > 0 ? (
          <AlertCircle className="text-destructive h-4 w-4 shrink-0" />
        ) : (
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
        )}
      </div>

      {invoices.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-muted-foreground text-sm">
            All invoices are on time — great job!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border border-b">
                <th className="text-muted-foreground px-6 py-3 text-left text-xs font-medium">
                  Client
                </th>
                <th className="text-muted-foreground px-6 py-3 text-left text-xs font-medium">
                  Invoice
                </th>
                <th className="text-muted-foreground px-6 py-3 text-right text-xs font-medium">
                  Amount
                </th>
                <th className="text-muted-foreground px-6 py-3 text-right text-xs font-medium">
                  Overdue
                </th>
                <th className="text-muted-foreground px-6 py-3 text-right text-xs font-medium">
                  Stage
                </th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {invoices.map((invoice) => {
                const { initials, color } = getAvatar(invoice.client.name)
                const tone = getEscalationTone(invoice)
                return (
                  <tr
                    key={invoice.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${color}`}
                        >
                          {initials}
                        </div>
                        <div>
                          <p className="text-foreground font-medium">
                            {invoice.client.name}
                          </p>
                          {invoice.client.company && (
                            <p className="text-muted-foreground text-xs">
                              {invoice.client.company}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="text-foreground hover:text-brand font-medium transition-colors"
                      >
                        {invoice.number}
                      </Link>
                    </td>
                    <td className="text-foreground px-6 py-3 text-right font-semibold tabular-nums">
                      {fmtCurrency(invoice.amount, invoice.currency)}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className="text-destructive font-medium tabular-nums">
                        {tone.daysOverdue}d
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tone.badgeClass}`}
                      >
                        {tone.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
