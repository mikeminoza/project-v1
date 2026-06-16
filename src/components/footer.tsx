import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-lg font-bold">
              Pay<span className="text-brand">Nudge</span>
            </Link>
            <p className="text-muted-foreground max-w-xs text-sm">
              Automated invoice reminders that get results — without the awkward
              conversations.
            </p>
          </div>
          <div>
            <h4 className="text-foreground mb-4 text-sm font-semibold">
              Product
            </h4>
            <ul className="text-muted-foreground space-y-3 text-sm">
              <li>
                <a
                  href="#features"
                  className="hover:text-foreground transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-foreground transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground mb-4 text-sm font-semibold">
              Company
            </h4>
            <ul className="text-muted-foreground space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground mb-4 text-sm font-semibold">
              Legal
            </h4>
            <ul className="text-muted-foreground space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-muted-foreground mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm sm:flex-row">
          <p>© 2026 PayNudge. All rights reserved.</p>
          <p>Built for freelancers, by freelancers.</p>
        </div>
      </div>
    </footer>
  )
}
