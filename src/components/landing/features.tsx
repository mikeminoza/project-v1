import {
  Bell,
  TrendingUp,
  Users,
  MessageSquare,
  Zap,
  ShieldCheck,
} from 'lucide-react'
import { FadeUp, Stagger, StaggerItem } from '@/components/ui/motion'

const features = [
  {
    icon: Bell,
    title: 'Automated Reminders',
    description:
      'Set it once and Invoze sends perfectly-timed reminders for every invoice — no manual follow-up needed.',
  },
  {
    icon: TrendingUp,
    title: 'Escalation Sequences',
    description:
      'Friendly first, firm when needed, final when necessary. Smart escalation that never burns bridges.',
  },
  {
    icon: Users,
    title: 'Client Portal',
    description:
      'Give clients a dedicated portal to view and pay invoices directly — no login required.',
  },
  {
    icon: MessageSquare,
    title: 'Custom Templates',
    description:
      'Your voice, automated. Customize every reminder to match your brand and relationship with each client.',
  },
  {
    icon: Zap,
    title: 'Real-time Tracking',
    description:
      'Know exactly who owes what. Get notified the moment a client opens your reminder or pays.',
  },
  {
    icon: ShieldCheck,
    title: 'Payment Analytics',
    description:
      'Visualize your cash flow, identify slow-paying clients, and forecast your monthly earnings.',
  },
]

export function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <FadeUp className="mb-16 text-center">
          <p className="text-brand mb-3 text-sm font-medium tracking-wider uppercase">
            Features
          </p>
          <h2 className="text-foreground text-4xl font-bold tracking-tight">
            Everything you need to get paid faster
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg">
            Invoze handles the entire follow-up process so you can focus on your
            actual work.
          </p>
        </FadeUp>
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="bg-card hover:border-brand/20 h-full rounded-2xl border border-white/5 p-6 transition-colors">
                <div className="bg-brand/10 mb-4 inline-flex rounded-xl p-3">
                  <feature.icon className="text-brand h-5 w-5" />
                </div>
                <h3 className="text-foreground mb-2 font-semibold">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
