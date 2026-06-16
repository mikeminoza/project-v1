import { AlertCircle, ArrowRight, CheckCircle, Clock } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#ffffff10,transparent)]" />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col gap-8">
            <div className="border-brand/20 bg-brand/10 text-brand inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-sm">
              <span className="bg-brand h-1.5 w-1.5 animate-pulse rounded-full" />
              No more awkward payment conversations
            </div>
            <h1 className="text-foreground text-5xl leading-[1.05] font-bold tracking-tight lg:text-6xl">
              Stop chasing.
              <br />
              <span className="text-brand">Start getting paid.</span>
            </h1>
            <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
              PayNudge sends automated invoice reminders so you never have to
              write another awkward follow-up email. Polite first, firm when
              needed.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="bg-brand text-brand-foreground inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              >
                Start for free
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#how-it-works"
                className="border-border text-foreground hover:bg-muted inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors"
              >
                See how it works
              </a>
            </div>
            <div className="text-muted-foreground flex flex-wrap items-center gap-6 text-sm">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="text-brand h-4 w-4" />
                Free forever plan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="text-brand h-4 w-4" />
                No credit card needed
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="text-brand h-4 w-4" />
                Setup in 2 minutes
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="bg-card rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-foreground font-semibold">
                  Outstanding Invoices
                </h3>
                <span className="bg-brand/10 text-brand rounded-full px-2.5 py-1 text-xs font-medium">
                  3 pending
                </span>
              </div>
              <div className="space-y-3">
                <div className="bg-background/50 rounded-xl border border-white/5 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-foreground font-medium">Acme Corp</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        INV-2024-041 · Due 3 days ago
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground font-semibold">$2,400</p>
                      <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-amber-400">
                        <Clock className="h-3 w-3" />
                        Reminded
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-foreground font-medium">
                        Studio Brand
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        INV-2024-038 · 14 days overdue
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground font-semibold">$850</p>
                      <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-red-400">
                        <AlertCircle className="h-3 w-3" />
                        Final notice
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-brand/20 bg-brand/5 rounded-xl border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-foreground font-medium">
                        Freelance Co
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        INV-2024-035 · Paid yesterday
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground font-semibold">$3,200</p>
                      <span className="text-brand mt-0.5 inline-flex items-center gap-1 text-xs">
                        <CheckCircle className="h-3 w-3" />
                        Paid
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-muted/50 mt-4 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Collected this month
                  </span>
                  <span className="text-foreground text-lg font-bold">
                    $14,850
                  </span>
                </div>
                <div className="bg-muted mt-2 h-2 overflow-hidden rounded-full">
                  <div className="bg-brand h-full w-[74%] rounded-full" />
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  74% of monthly target
                </p>
              </div>
            </div>
            <div className="bg-card absolute -bottom-4 -left-4 rounded-2xl border border-white/10 px-4 py-3 shadow-xl">
              <p className="text-muted-foreground text-xs">Avg. payment time</p>
              <p className="text-brand text-xl font-bold">3.2 days</p>
              <p className="text-muted-foreground text-xs">
                ↓ 8 days faster than before
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 border-t border-white/5 pt-10">
          {[
            { value: '2,400+', label: 'Freelancers using PayNudge' },
            { value: '$4.2M', label: 'Invoices collected' },
            { value: '8 days', label: 'Faster average payment' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-foreground text-3xl font-bold">{stat.value}</p>
              <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
