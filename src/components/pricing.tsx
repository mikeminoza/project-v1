import { CheckCircle } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'For freelancers just getting started.',
    features: [
      'Up to 3 active clients',
      'Manual reminder sending',
      '3 email templates',
      'Basic invoice tracking',
      'Email support',
    ],
    cta: 'Get started free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per month',
    description: 'For freelancers serious about cash flow.',
    features: [
      'Unlimited clients',
      'Automated reminder sequences',
      'Unlimited email templates',
      'Client payment portal',
      'Real-time notifications',
      'Payment analytics',
      'Priority support',
    ],
    cta: 'Start Pro — free 14 days',
    highlight: true,
  },
  {
    name: 'Business',
    price: '$29',
    period: 'per month',
    description: 'For agencies and teams.',
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Custom branding on emails',
      'White-label client portal',
      'Advanced analytics & reports',
      'API access',
      'Dedicated support',
    ],
    cta: 'Start Business — free 14 days',
    highlight: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="text-brand mb-3 text-sm font-medium tracking-wider uppercase">
            Pricing
          </p>
          <h2 className="text-foreground text-4xl font-bold tracking-tight">
            Simple, honest pricing
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Start free. Upgrade when you are ready.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                plan.highlight
                  ? 'border-brand bg-brand/5'
                  : 'bg-card border-white/5'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-brand text-brand-foreground rounded-full px-4 py-1 text-xs font-semibold">
                    Most popular
                  </span>
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-foreground text-lg font-semibold">
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-foreground text-4xl font-bold">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    /{plan.period}
                  </span>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  {plan.description}
                </p>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-muted-foreground flex items-center gap-3 text-sm"
                  >
                    <CheckCircle className="text-brand h-4 w-4 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={`block rounded-full py-3 text-center text-sm font-semibold transition-opacity hover:opacity-90 ${
                  plan.highlight
                    ? 'bg-brand text-brand-foreground'
                    : 'bg-foreground text-background'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
