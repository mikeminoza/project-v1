'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

export function Navbar() {
  return (
    <header className="bg-background/80 fixed top-0 z-50 w-full border-b border-white/5 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Logo size={28} />

        {/* Desktop nav */}
        <nav className="hidden items-center md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'text-muted-foreground hover:text-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/sign-in"
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className={cn(buttonVariants({ size: 'sm' }), 'rounded-full')}
          >
            Get started free
          </Link>
        </div>

        {/* Mobile menu — Base UI uses render prop, not asChild */}
        <Sheet>
          <SheetTrigger
            className="md:hidden"
            render={<Button variant="ghost" size="icon" />}
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="flex w-72 flex-col px-6 py-6">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <Logo size={24} />

            <nav className="mt-8 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-2 border-t border-white/5 pt-6">
              <Link
                href="/sign-in"
                className={cn(buttonVariants({ variant: 'ghost' }), 'w-full')}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className={cn(buttonVariants(), 'w-full rounded-full')}
              >
                Get started free
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
