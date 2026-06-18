import { AlertCircle, DollarSign, Percent, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { invoicesDb } from '@/lib/db'
import { StatCard } from '@/components/dashboard/stat-card'
import { RevenueChart } from '@/components/dashboard/analytics/revenue-chart'
import { SlowPayers } from '@/components/dashboard/analytics/slow-payers'

function fmtCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const [stats, monthlyRevenue, overdueInvoices] = await Promise.all([
    invoicesDb.getStats(supabase),
    invoicesDb.getMonthlyRevenue(supabase),
    invoicesDb.getOverdueInvoices(supabase),
  ])

  const totalInvoiced = stats.paid + stats.outstanding
  const collectionRate =
    totalInvoiced > 0 ? Math.round((stats.paid / totalInvoiced) * 100) : 0

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Analytics
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Your invoicing performance at a glance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total revenue"
          value={fmtCurrency(stats.paid)}
          sub="All paid invoices"
          icon={DollarSign}
        />
        <StatCard
          label="Outstanding"
          value={fmtCurrency(stats.outstanding)}
          sub="Awaiting payment"
          icon={TrendingUp}
        />
        <StatCard
          label="Collection rate"
          value={`${collectionRate}%`}
          sub="Paid vs total invoiced"
          icon={Percent}
        />
        <StatCard
          label="Overdue"
          value={String(stats.overdue)}
          sub={
            stats.overdue === 0
              ? 'All invoices on time'
              : `${stats.overdue} invoice${stats.overdue === 1 ? '' : 's'} past due`
          }
          icon={AlertCircle}
          variant={stats.overdue > 0 ? 'danger' : 'default'}
        />
      </div>

      {/* Revenue chart */}
      <div className="mb-6">
        <RevenueChart data={monthlyRevenue} />
      </div>

      {/* Slow payers */}
      <SlowPayers invoices={overdueInvoices} />
    </div>
  )
}
