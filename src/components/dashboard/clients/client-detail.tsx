'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Pencil,
  Plus,
  FileText,
} from 'lucide-react'
import { getAvatar } from '@/lib/avatar'
import { getEscalationTone } from '@/lib/escalation'
import { Button, buttonVariants } from '@/components/ui/button'
import { ClientDialog } from './client-dialog'
import type { Client, Invoice } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  client: Client
  invoices: Invoice[]
}

function fmtCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

function fmtDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  pending: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  paid: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  overdue: 'bg-red-500/15 text-red-700 dark:text-red-400',
}

export function ClientDetail({ client, invoices }: Props) {
  const [editOpen, setEditOpen] = useState(false)
  const { initials, color } = getAvatar(client.name)

  const totalBilled = invoices.reduce((s, i) => s + Number(i.amount), 0)
  const totalPaid = invoices
    .filter((i) => i.status === 'paid')
    .reduce((s, i) => s + Number(i.amount), 0)
  const outstanding = invoices
    .filter((i) => i.status === 'pending' || i.status === 'overdue')
    .reduce((s, i) => s + Number(i.amount), 0)

  const primaryCurrency = invoices[0]?.currency ?? 'USD'

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="border-border border-b px-6 py-4">
        <Link
          href="/dashboard/clients"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Clients
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold ${color}`}
            >
              {initials}
            </div>
            <div>
              <h1 className="text-foreground text-xl font-bold">
                {client.name}
              </h1>
              {client.company && (
                <p className="text-muted-foreground text-sm">
                  {client.company}
                </p>
              )}
              <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {client.email}
                </span>
                {client.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {client.phone}
                  </span>
                )}
                {client.address && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {client.address}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Link
              href="/dashboard/invoices/new"
              className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5')}
            >
              <Plus className="h-3.5 w-3.5" />
              New invoice
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-border grid grid-cols-2 border-b sm:grid-cols-4">
        {[
          {
            label: 'Total billed',
            value: fmtCurrency(totalBilled, primaryCurrency),
          },
          {
            label: 'Total paid',
            value: fmtCurrency(totalPaid, primaryCurrency),
          },
          {
            label: 'Outstanding',
            value: fmtCurrency(outstanding, primaryCurrency),
          },
          {
            label: 'Invoices',
            value: String(invoices.length),
          },
        ].map(({ label, value }, i) => (
          <div
            key={label}
            className={cn(
              'px-6 py-4',
              i < 3 && 'border-border border-r',
              i >= 2 && 'border-border border-t sm:border-t-0',
            )}
          >
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {label}
            </p>
            <p className="text-foreground mt-1 text-xl font-bold tabular-nums">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Invoice history */}
      <div className="flex-1 p-6">
        <h2 className="text-foreground mb-4 font-semibold">Invoice History</h2>

        {invoices.length === 0 ? (
          <div className="border-border flex flex-col items-center justify-center rounded-xl border py-16 text-center">
            <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <FileText className="text-muted-foreground h-5 w-5" />
            </div>
            <p className="text-foreground mb-1 text-sm font-semibold">
              No invoices yet
            </p>
            <p className="text-muted-foreground mb-5 text-sm">
              Create the first invoice for {client.name}.
            </p>
            <Link
              href="/dashboard/invoices/new"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'gap-2',
              )}
            >
              <Plus className="h-3.5 w-3.5" />
              New invoice
            </Link>
          </div>
        ) : (
          <div className="border-border overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border bg-muted/50 border-b">
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wide uppercase">
                    Invoice
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wide uppercase">
                    Status
                  </th>
                  <th className="text-muted-foreground hidden px-4 py-3 text-left text-xs font-medium tracking-wide uppercase sm:table-cell">
                    Issued
                  </th>
                  <th className="text-muted-foreground hidden px-4 py-3 text-left text-xs font-medium tracking-wide uppercase sm:table-cell">
                    Due
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-right text-xs font-medium tracking-wide uppercase">
                    Amount
                  </th>
                  <th className="text-muted-foreground hidden px-4 py-3 text-right text-xs font-medium tracking-wide uppercase md:table-cell">
                    Stage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {invoices.map((invoice) => {
                  const tone = getEscalationTone(invoice)
                  return (
                    <tr
                      key={invoice.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/invoices/${invoice.id}`}
                          className="text-foreground hover:text-brand font-medium transition-colors"
                        >
                          {invoice.number}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                            STATUS_STYLES[invoice.status] ??
                              STATUS_STYLES.draft,
                          )}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="text-muted-foreground hidden px-4 py-3 sm:table-cell">
                        {fmtDate(invoice.issue_date)}
                      </td>
                      <td className="text-muted-foreground hidden px-4 py-3 sm:table-cell">
                        {fmtDate(invoice.due_date)}
                      </td>
                      <td className="text-foreground px-4 py-3 text-right font-semibold tabular-nums">
                        {fmtCurrency(invoice.amount, invoice.currency)}
                      </td>
                      <td className="hidden px-4 py-3 text-right md:table-cell">
                        {invoice.status !== 'paid' &&
                        invoice.status !== 'draft' ? (
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                              tone.badgeClass,
                            )}
                          >
                            {tone.label}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ClientDialog
        key={client.id}
        open={editOpen}
        onOpenChange={setEditOpen}
        client={client}
      />
    </div>
  )
}
