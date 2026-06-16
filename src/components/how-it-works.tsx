const steps = [
  {
    number: '01',
    title: 'Add your invoice',
    description:
      'Import from your invoicing tool or add manually. PayNudge works with FreshBooks, QuickBooks, Wave, and more.',
  },
  {
    number: '02',
    title: 'Set your reminder schedule',
    description:
      'Choose when and how often to remind. Use our proven templates or write your own — PayNudge handles the rest.',
  },
  {
    number: '03',
    title: 'Get paid faster',
    description:
      'Clients receive timely reminders and can pay instantly. You get notified the moment money hits your account.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-card/30 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="text-brand mb-3 text-sm font-medium tracking-wider uppercase">
            How it works
          </p>
          <h2 className="text-foreground text-4xl font-bold tracking-tight">
            Up and running in minutes
          </h2>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col gap-4">
              {i < steps.length - 1 && (
                <div className="absolute top-6 left-14 hidden h-px w-full border-t border-dashed border-white/10 lg:block" />
              )}
              <div className="flex items-center gap-4">
                <span className="border-brand/30 bg-brand/10 text-brand flex h-12 w-12 shrink-0 items-center justify-center rounded-full border font-mono text-sm font-bold">
                  {step.number}
                </span>
                <h3 className="text-foreground text-lg font-semibold">
                  {step.title}
                </h3>
              </div>
              <p className="text-muted-foreground pl-16 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
