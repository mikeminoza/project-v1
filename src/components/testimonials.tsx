const testimonials = [
  {
    quote:
      "I used to spend 2 hours every Friday chasing late invoices. PayNudge handles all of it automatically — I haven't manually followed up in 3 months.",
    name: 'Sarah Chen',
    role: 'Brand Designer',
    avatar: 'SC',
  },
  {
    quote:
      'My average payment time went from 45 days to 11 days after switching to PayNudge. That is not a small thing when you are a freelancer.',
    name: 'Marcus Reid',
    role: 'Freelance Developer',
    avatar: 'MR',
  },
  {
    quote:
      "The escalation sequences are brilliant. They start friendly and get firmer automatically. I've recovered thousands in previously ignored invoices.",
    name: 'Jamie Torres',
    role: 'Independent Consultant',
    avatar: 'JT',
  },
]

export function Testimonials() {
  return (
    <section className="bg-card/30 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="text-brand mb-3 text-sm font-medium tracking-wider uppercase">
            Testimonials
          </p>
          <h2 className="text-foreground text-4xl font-bold tracking-tight">
            Freelancers love PayNudge
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-card flex flex-col gap-4 rounded-2xl border border-white/5 p-6"
            >
              <p className="text-muted-foreground leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-auto flex items-center gap-3 border-t border-white/5 pt-4">
                <div className="bg-brand/10 text-brand flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    {t.name}
                  </p>
                  <p className="text-muted-foreground text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
