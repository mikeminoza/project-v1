import Link from 'next/link'

export function Navbar() {
  return (
    <header className="bg-background/80 fixed top-0 z-50 w-full border-b border-white/5 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Pay<span className="text-brand">Nudge</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Sign in
          </a>
          <a
            href="#"
            className="bg-foreground text-background rounded-full px-5 py-2 text-sm font-medium transition-opacity hover:opacity-90"
          >
            Get started free
          </a>
        </div>
      </div>
    </header>
  )
}
