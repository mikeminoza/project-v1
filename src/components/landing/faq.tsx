'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { FadeUp } from '@/components/ui/motion'

const faqs = [
  {
    question: 'How does Invoq work?',
    answer:
      'You add your invoices (or import them from your invoicing tool), set a reminder schedule, and Invoq sends automated follow-up emails on your behalf. You stay in full control — you can preview, pause, or customize any reminder at any time.',
  },
  {
    question: 'Will my clients know the reminders are automated?',
    answer:
      "No — unless you tell them. Invoq reminders look like regular emails from you, sent from your own email address. They are personalized with the client's name, invoice details, and your tone.",
  },
  {
    question: "What if a client still doesn't pay?",
    answer:
      'Invoq escalates automatically — starting polite and getting firmer over time. For truly unresponsive clients, we provide a final-notice template and a clear record of all communications you can use if you need to take further action.',
  },
  {
    question: 'Can I customize the reminder messages?',
    answer:
      'Absolutely. You can customize every template, use your own subject lines, and create different sequences for different client types. Your voice, automated.',
  },
  {
    question: 'Does Invoq integrate with my invoicing tool?',
    answer:
      'Yes. Invoq integrates with FreshBooks, QuickBooks, Wave, HoneyBook, Bonsai, and more. You can also import invoices manually via CSV or add them directly in Invoq.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes — no contracts, no cancellation fees. Cancel from your account settings in one click. Your data is yours and you can export it at any time.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <FadeUp className="mb-16 text-center">
          <p className="text-brand mb-3 text-sm font-medium tracking-wider uppercase">
            FAQ
          </p>
          <h2 className="text-foreground text-4xl font-bold tracking-tight">
            Common questions
          </h2>
        </FadeUp>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-card overflow-hidden rounded-xl border border-white/5"
            >
              <button
                className="flex w-full items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-foreground font-medium">
                  {faq.question}
                </span>
                {open === i ? (
                  <Minus className="text-muted-foreground h-4 w-4 shrink-0" />
                ) : (
                  <Plus className="text-muted-foreground h-4 w-4 shrink-0" />
                )}
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
