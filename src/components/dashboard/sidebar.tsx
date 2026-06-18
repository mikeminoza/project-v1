'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  BarChart3,
} from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { getAvatar } from '@/lib/avatar'
import { cn } from '@/lib/utils'
import { useSignOut } from '@/hooks/auth'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/invoices', label: 'Invoices', icon: FileText },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  user: User
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const { signOut } = useSignOut()
  const [open, setOpen] = useState(false)

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ?? user.email ?? ''
  const { initials, color } = getAvatar(displayName)

  function isActive(href: string) {
    return href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname.startsWith(href)
  }

  const navLinks = (
    <nav className="flex-1 space-y-0.5 px-3 py-4">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
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
  )

  const userSection = (
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
  )

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="bg-card border-border hidden w-64 flex-shrink-0 flex-col border-r md:flex">
        <div className="border-border flex h-16 items-center border-b px-6">
          <Logo size={24} />
        </div>
        {navLinks}
        {userSection}
      </aside>

      {/* ── Mobile header ── */}
      <header className="bg-card border-border flex h-14 flex-shrink-0 items-center justify-between border-b px-4 md:hidden">
        <Logo size={20} />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Open menu" />
            }
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="flex w-72 flex-col p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="border-border flex h-14 items-center border-b px-6">
              <Logo size={20} />
            </div>
            {navLinks}
            {userSection}
          </SheetContent>
        </Sheet>
      </header>
    </>
  )
}
