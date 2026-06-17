'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus,
  FileText,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  CheckCircle,
  Info,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { getAvatar } from '@/lib/avatar'
import { createClient } from '@/lib/supabase/client'
import { invoicesDb } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DeleteDialog } from './delete-dialog'
import { ToneBadge } from './tone-badge'
import { SendReminderButton } from './send-reminder-button'
import type { InvoiceWithClient } from '@/types'

interface InvoicesViewProps {
  invoices: InvoiceWithClient[]
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

function formatDueDate(dateStr: string) {
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

export function InvoicesView({ invoices }: InvoicesViewProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    invoice?: InvoiceWithClient
  }>({ open: false })

  const filtered = invoices.filter((inv) => {
    const q = search.toLowerCase()
    return (
      inv.number.toLowerCase().includes(q) ||
      inv.client.name.toLowerCase().includes(q) ||
      (inv.client.company?.toLowerCase().includes(q) ?? false)
    )
  })

  function openDelete(invoice: InvoiceWithClient) {
    setDeleteDialog({ open: true, invoice })
  }

  async function markAsPaid(id: string) {
    const supabase = createClient()
    await invoicesDb.update(supabase, id, { status: 'paid' })
    router.refresh()
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-foreground text-lg font-semibold">Invoices</h1>
          <p className="text-muted-foreground text-sm">
            {invoices.length === 0
              ? 'No invoices yet'
              : `${invoices.length} invoice${invoices.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/invoices/new')}>
          <Plus className="h-4 w-4" />
          New invoice
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {invoices.length === 0 ? (
          /* Empty state */
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
              <FileText className="text-muted-foreground h-8 w-8" />
            </div>
            <div>
              <p className="text-foreground font-medium">No invoices yet</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Create your first invoice to get started.
              </p>
            </div>
            <Button
              onClick={() => router.push('/dashboard/invoices/new')}
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              New invoice
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Follow-up Tone explainer */}
            <div className="bg-brand/5 border-brand/20 flex items-start gap-3 rounded-lg border p-3">
              <Info className="text-brand mt-0.5 h-4 w-4 flex-shrink-0" />
              <div>
                <p className="text-foreground text-xs font-medium">
                  Follow-up Tone
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Each unpaid invoice shows the recommended tone for your next
                  follow-up — updated automatically as days pass. Hover a badge
                  for guidance.
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search invoices…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Card list */}
            {filtered.length === 0 ? (
              <div className="text-muted-foreground py-12 text-center text-sm">
                No invoices match &quot;{search}&quot;
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((invoice) => {
                  const { initials, color } = getAvatar(invoice.client.name)
                  return (
                    <div
                      key={invoice.id}
                      className="bg-card border-border hover:bg-muted/40 relative flex cursor-pointer items-center gap-4 rounded-lg border px-4 py-3 transition-colors"
                      onClick={() =>
                        router.push(`/dashboard/invoices/${invoice.id}`)
                      }
                    >
                      {/* Avatar */}
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${color}`}
                      >
                        {initials}
                      </div>

                      {/* Client info */}
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground truncate leading-tight font-medium">
                          {invoice.client.name}
                        </p>
                        {invoice.client.company && (
                          <p className="text-muted-foreground truncate text-xs">
                            {invoice.client.company}
                          </p>
                        )}
                        <p className="text-muted-foreground mt-1 text-xs">
                          <span className="whitespace-nowrap">
                            {invoice.number}
                          </span>
                          <span className="mx-1.5">·</span>
                          <span className="whitespace-nowrap">
                            Due {formatDueDate(invoice.due_date)}
                          </span>
                        </p>
                      </div>

                      {/* Amount + badge */}
                      <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                        <span className="text-foreground font-semibold tabular-nums">
                          {formatAmount(invoice.amount, invoice.currency)}
                        </span>
                        <ToneBadge invoice={invoice} />
                      </div>

                      {/* Actions — stop propagation so the card click doesn't fire */}
                      <div
                        className="flex-shrink-0 self-start"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Invoice actions"
                              />
                            }
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/dashboard/invoices/${invoice.id}`)
                              }
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {(invoice.status === 'pending' ||
                              invoice.status === 'overdue') && (
                              <SendReminderButton
                                invoiceId={invoice.id}
                                variant="menu-item"
                              />
                            )}
                            {invoice.status !== 'paid' && (
                              <DropdownMenuItem
                                onClick={() => markAsPaid(invoice.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                                Mark as paid
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => openDelete(invoice)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete dialog */}
      {deleteDialog.invoice && (
        <DeleteDialog
          open={deleteDialog.open}
          onOpenChange={(open) =>
            setDeleteDialog((prev) => ({ ...prev, open }))
          }
          invoice={deleteDialog.invoice}
        />
      )}
    </div>
  )
}
