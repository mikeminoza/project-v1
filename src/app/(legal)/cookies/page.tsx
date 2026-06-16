import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy — Invoq',
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-10">
      <h2 className="text-foreground mb-4 text-xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
        {children}
      </div>
    </section>
  )
}

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-brand mb-3 text-sm font-medium tracking-wider uppercase">
          Legal
        </p>
        <h1 className="text-foreground text-4xl font-bold tracking-tight">
          Cookie Policy
        </h1>
        <p className="text-muted-foreground mt-4 text-sm">
          Last updated: June 16, 2026
        </p>
      </div>

      <div className="border-border mb-10 border-t" />

      <Section title="1. What Are Cookies">
        <p>
          Cookies are small text files stored on your device when you visit a
          website. They allow the site to remember your preferences and
          understand how you use it. We also use similar technologies such as
          local storage and session storage.
        </p>
      </Section>

      <Section title="2. Cookies We Use">
        <p>
          <strong className="text-foreground font-medium">
            Essential cookies:
          </strong>{' '}
          Required for the Service to function. These include session cookies
          that keep you logged in and security tokens that protect against
          cross-site request forgery. You cannot opt out of these.
        </p>
        <p>
          <strong className="text-foreground font-medium">
            Preference cookies:
          </strong>{' '}
          Remember your settings and choices (such as display preferences) so
          you don&apos;t have to re-enter them each visit.
        </p>
        <p>
          <strong className="text-foreground font-medium">
            Analytics cookies:
          </strong>{' '}
          Help us understand how visitors interact with the Service — which
          pages are visited, how long sessions last, and where users come from.
          This data is aggregated and anonymised. We use this to improve the
          product.
        </p>
        <p>
          <strong className="text-foreground font-medium">
            Marketing cookies:
          </strong>{' '}
          Used to measure the effectiveness of our advertising. We do not use
          third-party advertising cookies on authenticated pages of the Service.
        </p>
      </Section>

      <Section title="3. Third-Party Cookies">
        <p>
          Some third-party services we integrate with may set their own cookies.
          These are governed by the respective third parties&apos; privacy
          policies, not ours. Examples include:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Payment processors (for subscription management)</li>
          <li>Analytics providers (for usage data)</li>
          <li>Authentication providers (if you sign in via Google)</li>
        </ul>
      </Section>

      <Section title="4. Cookie Lifespans">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong className="text-foreground font-medium">
              Session cookies:
            </strong>{' '}
            Deleted when you close your browser.
          </li>
          <li>
            <strong className="text-foreground font-medium">
              Persistent cookies:
            </strong>{' '}
            Remain for a set period (typically 30 days to 1 year) or until you
            manually delete them.
          </li>
        </ul>
      </Section>

      <Section title="5. Managing Cookies">
        <p>
          You can control and delete cookies through your browser settings. Most
          browsers allow you to:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>View cookies currently stored on your device</li>
          <li>Block all or specific cookies</li>
          <li>Delete cookies when you close your browser</li>
        </ul>
        <p>
          Note that disabling essential cookies will prevent you from logging in
          and using the Service. Disabling analytics or preference cookies will
          not affect core functionality.
        </p>
        <p>
          You can find browser-specific instructions at{' '}
          <a
            href="https://www.allaboutcookies.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4"
          >
            allaboutcookies.org
          </a>
          .
        </p>
      </Section>

      <Section title="6. Changes to This Policy">
        <p>
          We may update this Cookie Policy as we add new features or
          integrations. When we do, we will update the &ldquo;last
          updated&rdquo; date above.
        </p>
      </Section>

      <Section title="7. Contact">
        <p>
          If you have questions about our use of cookies, contact us at{' '}
          <a
            href="mailto:privacy@invoq.com"
            className="text-foreground underline underline-offset-4"
          >
            privacy@invoq.com
          </a>
          .
        </p>
      </Section>
    </div>
  )
}
