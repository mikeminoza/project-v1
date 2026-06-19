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
  ArrowUpDown,
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
import type { InvoiceStatus, InvoiceWithClient } from '@/types'
import { cn } from '@/lib/utils'

type SortKey =
  | 'newest'
  | 'oldest'
  | 'due-asc'
  | 'due-desc'
  | 'amount-desc'
  | 'amount-asc'

const SORT_LABELS: Record<SortKey, string> = {
  newest: 'Newest first',
  oldest: 'Oldest first',
  'due-asc': 'Due date (soonest)',
  'due-desc': 'Due date (latest)',
  'amount-desc': 'Amount (high → low)',
  'amount-asc': 'Amount (low → high)',
}

const STATUS_TABS: { key: 'all' | InvoiceStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'draft', label: 'Draft' },
  { key: 'paid', label: 'Paid' },
]

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
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all')
  const [sortBy, setSortBy] = useState<SortKey>('newest')
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    invoice?: InvoiceWithClient
  }>({ open: false })

  // Counts per status (ignores search so tabs always show real totals)
  const counts = invoices.reduce<Record<string, number>>(
    (acc, inv) => {
      acc.all = (acc.all ?? 0) + 1
      acc[inv.status] = (acc[inv.status] ?? 0) + 1
      return acc
    },
    { all: 0, draft: 0, pending: 0, overdue: 0, paid: 0 },
  )

  // Filter by search + status
  const afterFilter = invoices.filter((inv) => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false
    const q = search.toLowerCase()
    if (!q) return true
    return (
      inv.number.toLowerCase().includes(q) ||
      inv.client.name.toLowerCase().includes(q) ||
      (inv.client.company?.toLowerCase().includes(q) ?? false)
    )
  })

  // Sort
  const filtered = [...afterFilter].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      case 'oldest':
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      case 'due-asc':
        return a.due_date.localeCompare(b.due_date)
      case 'due-desc':
        return b.due_date.localeCompare(a.due_date)
      case 'amount-desc':
        return Number(b.amount) - Number(a.amount)
      case 'amount-asc':
        return Number(a.amount) - Number(b.amount)
      default:
        return 0
    }
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

            {/* Status tabs */}
            <div className="flex flex-wrap gap-1">
              {STATUS_TABS.map(({ key, label }) => {
                const count = counts[key] ?? 0
                const isActive = statusFilter === key
                return (
                  <button
                    key={key}
                    onClick={() => setStatusFilter(key)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-foreground text-background'
                        : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80',
                    )}
                  >
                    {label}
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.5 text-xs tabular-nums',
                        isActive
                          ? 'bg-background/20 text-background'
                          : 'bg-background text-muted-foreground',
                      )}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Search + Sort */}
            <div className="flex items-center gap-2">
              <div className="relative max-w-sm flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Search by client, number…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 gap-1.5"
                    />
                  }
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  {SORT_LABELS[sortBy]}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {(Object.entries(SORT_LABELS) as [SortKey, string][]).map(
                    ([key, label]) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => setSortBy(key)}
                        className={cn(sortBy === key && 'font-medium')}
                      >
                        {label}
                      </DropdownMenuItem>
                    ),
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Results */}
            {filtered.length === 0 ? (
              <div className="text-muted-foreground py-12 text-center text-sm">
                {search
                  ? `No invoices match "${search}"`
                  : `No ${statusFilter === 'all' ? '' : statusFilter + ' '}invoices`}
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

                      {/* Client info + amount */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <p className="text-foreground flex-1 truncate leading-tight font-medium">
                            {invoice.client.name}
                          </p>
                          <span className="text-foreground flex-shrink-0 text-sm font-semibold tabular-nums">
                            {formatAmount(invoice.amount, invoice.currency)}
                          </span>
                        </div>
                        {invoice.client.company && (
                          <p className="text-muted-foreground truncate text-xs">
                            {invoice.client.company}
                          </p>
                        )}
                        <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                          <span className="text-muted-foreground text-xs whitespace-nowrap">
                            {invoice.number}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            ·
                          </span>
                          <span className="text-muted-foreground text-xs whitespace-nowrap">
                            Due {formatDueDate(invoice.due_date)}
                          </span>
                          <ToneBadge invoice={invoice} />
                        </div>
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
