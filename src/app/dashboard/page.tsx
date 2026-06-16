import Link from 'next/link'
import { AlertCircle, DollarSign, FileText, Plus, Users } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { StatCard } from '@/components/dashboard/stat-card'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8">
      {/* Page header */}
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
          value="0"
          sub="No invoices created yet"
          icon={FileText}
        />
        <StatCard
          label="Outstanding"
          value="$0.00"
          sub="Awaiting payment"
          icon={DollarSign}
        />
        <StatCard
          label="Paid this month"
          value="$0.00"
          sub="No payments recorded"
          icon={DollarSign}
        />
        <StatCard
          label="Overdue"
          value="0"
          sub="All invoices on time"
          icon={AlertCircle}
        />
      </div>

      {/* Recent invoices */}
      <div className="bg-card border-border rounded-xl border">
        <div className="border-border flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-foreground font-semibold">Recent Invoices</h2>
          <Link
            href="/dashboard/invoices"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            View all
          </Link>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <FileText className="text-muted-foreground h-5 w-5" />
          </div>
          <h3 className="text-foreground mb-1 text-sm font-semibold">
            No invoices yet
          </h3>
          <p className="text-muted-foreground mb-5 text-sm">
            Create your first invoice to start tracking payments.
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
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="bg-card border-border rounded-xl border p-6">
          <div className="bg-brand/10 mb-4 flex h-10 w-10 items-center justify-center rounded-lg">
            <Users className="text-brand h-5 w-5" />
          </div>
          <h3 className="text-foreground mb-1 font-semibold">Add clients</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Save your clients&apos; details to quickly create invoices.
          </p>
          <Link
            href="/dashboard/clients/new"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'rounded-full',
            )}
          >
            Add client
          </Link>
        </div>

        <div className="bg-card border-border rounded-xl border p-6">
          <div className="bg-brand/10 mb-4 flex h-10 w-10 items-center justify-center rounded-lg">
            <FileText className="text-brand h-5 w-5" />
          </div>
          <h3 className="text-foreground mb-1 font-semibold">
            Set up reminders
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Configure automatic follow-ups so you never have to chase manually.
          </p>
          <Link
            href="/dashboard/settings"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'rounded-full',
            )}
          >
            Configure
          </Link>
        </div>
      </div>
    </div>
  )
}
