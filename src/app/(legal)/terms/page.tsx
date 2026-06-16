import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Invoq',
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

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-brand mb-3 text-sm font-medium tracking-wider uppercase">
          Legal
        </p>
        <h1 className="text-foreground text-4xl font-bold tracking-tight">
          Terms of Service
        </h1>
        <p className="text-muted-foreground mt-4 text-sm">
          Last updated: June 16, 2026
        </p>
      </div>

      <div className="border-border mb-10 border-t" />

      <Section title="1. Agreement to Terms">
        <p>
          By accessing or using Invoq (&ldquo;the Service&rdquo;), you agree to
          be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do
          not agree to these Terms, do not use the Service.
        </p>
        <p>
          These Terms apply to all users, including visitors, registered users,
          and paying subscribers.
        </p>
      </Section>

      <Section title="2. Description of Service">
        <p>
          Invoq is an automated invoice reminder service designed for
          freelancers and small businesses. The Service enables you to send
          automated follow-up emails to clients regarding outstanding invoices.
        </p>
        <p>
          We reserve the right to modify, suspend, or discontinue the Service at
          any time with reasonable notice.
        </p>
      </Section>

      <Section title="3. Account Registration">
        <p>
          To use the Service, you must create an account. You agree to provide
          accurate, current, and complete information during registration and to
          keep your account information updated.
        </p>
        <p>
          You are responsible for maintaining the confidentiality of your
          password and for all activity that occurs under your account. Notify
          us immediately at{' '}
          <a
            href="mailto:support@invoq.com"
            className="text-foreground underline underline-offset-4"
          >
            support@invoq.com
          </a>{' '}
          if you suspect unauthorised access.
        </p>
        <p>You must be at least 16 years of age to use the Service.</p>
      </Section>

      <Section title="4. Subscription Plans and Billing">
        <p>
          Invoq offers free and paid subscription plans. Paid plans are billed
          on a monthly or annual basis, as selected at checkout.
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            All fees are stated in USD and are exclusive of applicable taxes.
          </li>
          <li>
            Subscriptions automatically renew at the end of each billing period
            unless cancelled.
          </li>
          <li>
            We reserve the right to change pricing with 30 days&apos; notice.
            Continued use after the effective date constitutes acceptance.
          </li>
          <li>
            Payments are processed by a third-party payment processor. We do not
            store your payment card details.
          </li>
        </ul>
      </Section>

      <Section title="5. Free Trial">
        <p>
          Paid plans may include a free trial period as advertised. At the end
          of the trial, your account will automatically convert to the paid plan
          unless you cancel before the trial expires.
        </p>
      </Section>

      <Section title="6. Cancellation and Refunds">
        <p>
          You may cancel your subscription at any time from your account
          settings. Cancellation takes effect at the end of the current billing
          period — you retain access until then.
        </p>
        <p>
          We do not provide refunds for partial billing periods. If you believe
          you were charged in error, contact{' '}
          <a
            href="mailto:billing@invoq.com"
            className="text-foreground underline underline-offset-4"
          >
            billing@invoq.com
          </a>{' '}
          within 14 days of the charge.
        </p>
      </Section>

      <Section title="7. Acceptable Use">
        <p>You agree not to use the Service to:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Send spam, unsolicited emails, or harassing communications</li>
          <li>Violate any applicable laws or regulations</li>
          <li>
            Impersonate another person or misrepresent your identity or
            affiliation
          </li>
          <li>
            Interfere with or disrupt the integrity or performance of the
            Service
          </li>
          <li>
            Attempt to gain unauthorised access to the Service or its related
            systems
          </li>
          <li>
            Use the Service to send reminders for invoices you are not
            authorised to collect
          </li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts that violate
          these terms without prior notice.
        </p>
      </Section>

      <Section title="8. Your Data">
        <p>
          You retain ownership of all data you submit to the Service, including
          invoice and client data. By using the Service, you grant Invoq a
          limited licence to use that data solely to provide the Service.
        </p>
        <p>
          For details on how we handle your data, see our{' '}
          <a
            href="/privacy"
            className="text-foreground underline underline-offset-4"
          >
            Privacy Policy
          </a>
          .
        </p>
      </Section>

      <Section title="9. Intellectual Property">
        <p>
          The Service, including its design, code, content, and trademarks, is
          owned by Invoq and protected by intellectual property laws. You may
          not copy, modify, distribute, or reverse-engineer any part of the
          Service without our prior written consent.
        </p>
      </Section>

      <Section title="10. Disclaimer of Warranties">
        <p>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; without warranties of any kind, either express or
          implied, including but not limited to warranties of merchantability,
          fitness for a particular purpose, or non-infringement.
        </p>
        <p>
          We do not warrant that the Service will be uninterrupted, error-free,
          or that emails will be delivered successfully — delivery depends on
          factors outside our control.
        </p>
      </Section>

      <Section title="11. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, Invoq shall not be liable for
          any indirect, incidental, special, consequential, or punitive damages,
          including loss of revenue, loss of data, or business interruption,
          arising from your use of the Service.
        </p>
        <p>
          Our total liability to you for any claim arising from these Terms or
          the Service shall not exceed the amount you paid us in the 12 months
          preceding the claim.
        </p>
      </Section>

      <Section title="12. Governing Law">
        <p>
          These Terms are governed by and construed in accordance with
          applicable law. Any disputes shall be resolved through binding
          arbitration or in the courts of the jurisdiction where Invoq is
          registered.
        </p>
      </Section>

      <Section title="13. Changes to Terms">
        <p>
          We may update these Terms at any time. If we make material changes, we
          will notify you by email or through the Service at least 14 days
          before the changes take effect. Continued use after the effective date
          constitutes acceptance of the updated Terms.
        </p>
      </Section>

      <Section title="14. Contact">
        <p>If you have questions about these Terms, please contact us at:</p>
        <p>
          <a
            href="mailto:legal@invoq.com"
            className="text-foreground underline underline-offset-4"
          >
            legal@invoq.com
          </a>
        </p>
      </Section>
    </div>
  )
}
