import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  sub: string
  icon: LucideIcon
  variant?: 'default' | 'danger'
}

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  variant = 'default',
}: StatCardProps) {
  return (
    <div className="bg-card border-border rounded-xl border p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-muted-foreground text-sm font-medium">
          {label}
        </span>
        <div
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg',
            variant === 'danger' ? 'bg-destructive/10' : 'bg-brand/10',
          )}
        >
          <Icon
            className={cn(
              'h-4 w-4',
              variant === 'danger' ? 'text-destructive' : 'text-brand',
            )}
          />
        </div>
      </div>
      <p className="text-foreground text-2xl font-bold">{value}</p>
      <p className="text-muted-foreground mt-1 text-xs">{sub}</p>
    </div>
  )
}
