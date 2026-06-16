import { ArrowRight } from 'lucide-react'

export function CTABanner() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="border-brand/20 bg-brand/5 rounded-3xl border px-8 py-16 text-center">
          <h2 className="text-foreground text-4xl font-bold tracking-tight">
            Ready to stop chasing?
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-lg">
            Start for free — no credit card needed. Set up your first reminder
            in minutes.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#"
              className="bg-brand text-brand-foreground inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="border-border text-foreground hover:bg-muted inline-flex items-center justify-center gap-2 rounded-full border px-8 py-3.5 text-sm font-semibold transition-colors"
            >
              Book a demo
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
