import Link from 'next/link'
import { AlertCircle, DollarSign, FileText, Plus, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { clientsDb, invoicesDb } from '@/lib/db'
import { getAvatar } from '@/lib/avatar'
import { buttonVariants } from '@/components/ui/button'
import { StatCard } from '@/components/dashboard/stat-card'
import { OutstandingInvoicesWidget } from '@/components/dashboard/outstanding-invoices'
import { cn } from '@/lib/utils'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const [stats, recentClients, outstandingInvoices, monthlyPaid] =
    await Promise.all([
      invoicesDb.getStats(supabase),
      clientsDb.getRecent(supabase),
      invoicesDb.getOutstanding(supabase, 5),
      invoicesDb.getMonthlyPaid(supabase),
    ])

  const { total: totalInvoices, outstanding, paid, overdue } = stats

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Overview
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Here&apos;s what&apos;s happening with your invoices.
          </p>
        </div>
        <Link
          href="/dashboard/invoices/new"
          className={cn(buttonVariants({ size: 'sm' }), 'gap-2 rounded-full')}
        >
          <Plus className="h-4 w-4" />
          New invoice
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total invoices"
          value={String(totalInvoices)}
          sub={
            totalInvoices === 0
              ? 'No invoices yet'
              : `${totalInvoices} invoice${totalInvoices === 1 ? '' : 's'} total`
          }
          icon={FileText}
        />
        <StatCard
          label="Outstanding"
          value={formatCurrency(outstanding)}
          sub="Awaiting payment"
          icon={DollarSign}
        />
        <StatCard
          label="Total paid"
          value={formatCurrency(paid)}
          sub="Across all invoices"
          icon={DollarSign}
        />
        <StatCard
          label="Overdue"
          value={String(overdue)}
          sub={
            overdue === 0
              ? 'All invoices on time'
              : `${overdue} invoice${overdue === 1 ? '' : 's'} past due`
          }
          icon={AlertCircle}
          variant={overdue > 0 ? 'danger' : 'default'}
        />
      </div>

      {/* Bottom grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <OutstandingInvoicesWidget
          invoices={outstandingInvoices}
          monthlyPaid={monthlyPaid}
          outstandingTotal={outstanding}
        />

        {/* Recent Clients */}
        <div className="bg-card border-border rounded-xl border">
          <div className="border-border flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-foreground font-semibold">Recent Clients</h2>
            <Link
              href="/dashboard/clients"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              View all
            </Link>
          </div>

          {recentClients.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Users className="text-muted-foreground h-5 w-5" />
              </div>
              <h3 className="text-foreground mb-1 text-sm font-semibold">
                No clients yet
              </h3>
              <p className="text-muted-foreground mb-5 text-sm">
                Add clients to start creating invoices.
              </p>
              <Link
                href="/dashboard/clients"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'gap-2 rounded-full',
                )}
              >
                <Plus className="h-3.5 w-3.5" />
                Add client
              </Link>
            </div>
          ) : (
            <ul className="divide-border divide-y">
              {recentClients.map((client) => {
                const { initials, color } = getAvatar(client.name)
                return (
                  <li
                    key={client.id}
                    className="flex items-center gap-3 px-6 py-3"
                  >
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${color}`}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground truncate text-sm font-medium">
                        {client.name}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {client.company ?? client.email}
                      </p>
                    </div>
                    <Link
                      href="/dashboard/clients"
                      className="text-muted-foreground hover:text-foreground flex-shrink-0 text-xs transition-colors"
                    >
                      View
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
