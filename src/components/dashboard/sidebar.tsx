'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
} from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { Logo } from '@/components/ui/logo'
import { getAvatar } from '@/lib/avatar'
import { cn } from '@/lib/utils'
import { useSignOut } from '@/hooks/auth'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/invoices', label: 'Invoices', icon: FileText },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  user: User
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const { signOut } = useSignOut()

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ?? user.email ?? ''
  const { initials, color } = getAvatar(displayName)

  function isActive(href: string) {
    return href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname.startsWith(href)
  }

  return (
    <aside className="bg-card border-border hidden w-64 flex-shrink-0 flex-col border-r md:flex">
      {/* Logo */}
      <div className="border-border flex h-16 items-center border-b px-6">
        <Logo size={24} />
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive(href)
                ? 'bg-brand/10 text-brand'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* User + sign out */}
      <div className="border-border border-t p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${color}`}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate text-sm font-medium">
              {displayName}
            </p>
            {displayName !== user.email && (
              <p className="text-muted-foreground truncate text-xs">
                {user.email}
              </p>
            )}
          </div>
          <button
            onClick={signOut}
            aria-label="Sign out"
            className="text-muted-foreground hover:text-foreground flex-shrink-0 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
