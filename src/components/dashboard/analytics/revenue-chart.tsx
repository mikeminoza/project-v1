'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { MonthlyRevenue } from '@/lib/db/invoices'

interface Props {
  data: MonthlyRevenue[]
}

function fmtYAxis(v: number) {
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`
  return `$${v}`
}

export function RevenueChart({ data }: Props) {
  return (
    <div className="bg-card border-border rounded-xl border p-6">
      <h2 className="text-foreground font-semibold">Monthly Revenue</h2>
      <p className="text-muted-foreground mt-0.5 mb-6 text-sm">
        Paid invoices over the last 6 months
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          barSize={32}
          margin={{ top: 4, right: 4, bottom: 0, left: 4 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            tickFormatter={fmtYAxis}
            width={52}
          />
          <Tooltip
            cursor={{ fill: 'var(--muted)', opacity: 0.6 }}
            contentStyle={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: 13,
            }}
            formatter={(v) => [
              Number(v ?? 0).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
              }),
              'Paid',
            ]}
          />
          <Bar dataKey="paid" fill="var(--brand)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
