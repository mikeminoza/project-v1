import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Invoze',
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

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-brand mb-3 text-sm font-medium tracking-wider uppercase">
          Legal
        </p>
        <h1 className="text-foreground text-4xl font-bold tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mt-4 text-sm">
          Last updated: June 16, 2026
        </p>
      </div>

      <div className="border-border mb-10 border-t" />

      <Section title="1. Introduction">
        <p>
          Invoze (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;)
          operates the Invoze invoice reminder service (the
          &ldquo;Service&rdquo;). This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you use our
          Service.
        </p>
        <p>
          By using Invoze, you agree to the collection and use of information in
          accordance with this policy. If you do not agree, please do not use
          the Service.
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <p>
          <strong className="text-foreground font-medium">
            Account information:
          </strong>{' '}
          When you register, we collect your name, email address, and password
          (stored as a secure hash).
        </p>
        <p>
          <strong className="text-foreground font-medium">Invoice data:</strong>{' '}
          To provide the Service, we store invoice details you enter — including
          client names, email addresses, invoice amounts, and due dates. This
          data is used solely to send reminders on your behalf.
        </p>
        <p>
          <strong className="text-foreground font-medium">Usage data:</strong>{' '}
          We collect information about how you interact with the Service, such
          as pages visited, features used, and actions taken. This helps us
          improve the product.
        </p>
        <p>
          <strong className="text-foreground font-medium">
            Communication data:
          </strong>{' '}
          When you contact us for support, we retain that correspondence to help
          resolve your issue.
        </p>
      </Section>

      <Section title="3. How We Use Your Information">
        <p>We use the information we collect to:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Provide, operate, and maintain the Service</li>
          <li>Send invoice reminders to your clients on your behalf</li>
          <li>Process transactions and manage your subscription</li>
          <li>Send you account and service-related notifications</li>
          <li>Respond to support requests</li>
          <li>Monitor and analyse usage to improve the Service</li>
          <li>Detect and prevent fraud or abuse</li>
          <li>
            Send product updates and promotional communications (you can opt out
            at any time)
          </li>
        </ul>
        <p>
          We do not sell your personal data or your clients&apos; data to third
          parties.
        </p>
      </Section>

      <Section title="4. Data Sharing">
        <p>
          We share your information only in the following limited circumstances:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong className="text-foreground font-medium">
              Service providers:
            </strong>{' '}
            We use trusted third-party providers for hosting, email delivery,
            payment processing, and analytics. These providers access your data
            only to perform services on our behalf.
          </li>
          <li>
            <strong className="text-foreground font-medium">
              Legal requirements:
            </strong>{' '}
            We may disclose your data if required by law or in response to valid
            legal process.
          </li>
          <li>
            <strong className="text-foreground font-medium">
              Business transfers:
            </strong>{' '}
            If Invoze is acquired or merges with another company, your data may
            be transferred. We will notify you before any such transfer.
          </li>
        </ul>
      </Section>

      <Section title="5. Data Retention">
        <p>
          We retain your account data for as long as your account is active. If
          you delete your account, we will delete your personal data within 30
          days, except where retention is required by law or for legitimate
          business purposes (such as fraud prevention).
        </p>
        <p>
          Invoice and client data is deleted immediately upon account deletion.
        </p>
      </Section>

      <Section title="6. Security">
        <p>
          We implement industry-standard security measures including encryption
          in transit (TLS), encryption at rest, and access controls. However, no
          method of transmission over the internet is 100% secure, and we cannot
          guarantee absolute security.
        </p>
        <p>
          If you discover a security vulnerability, please report it to{' '}
          <a
            href="mailto:security@Invoze.com"
            className="text-foreground underline underline-offset-4"
          >
            security@Invoze.com
          </a>
          .
        </p>
      </Section>

      <Section title="7. Your Rights">
        <p>
          Depending on your location, you may have the following rights
          regarding your personal data:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong className="text-foreground font-medium">Access:</strong>{' '}
            Request a copy of the data we hold about you.
          </li>
          <li>
            <strong className="text-foreground font-medium">Correction:</strong>{' '}
            Request correction of inaccurate data.
          </li>
          <li>
            <strong className="text-foreground font-medium">Deletion:</strong>{' '}
            Request deletion of your data.
          </li>
          <li>
            <strong className="text-foreground font-medium">
              Portability:
            </strong>{' '}
            Receive your data in a structured, machine-readable format.
          </li>
          <li>
            <strong className="text-foreground font-medium">Objection:</strong>{' '}
            Object to certain types of processing, including marketing.
          </li>
        </ul>
        <p>
          To exercise any of these rights, email us at{' '}
          <a
            href="mailto:privacy@Invoze.com"
            className="text-foreground underline underline-offset-4"
          >
            privacy@Invoze.com
          </a>
          . We will respond within 30 days.
        </p>
      </Section>

      <Section title="8. Cookies">
        <p>
          We use cookies and similar tracking technologies to operate the
          Service and analyse usage. For full details, see our{' '}
          <a
            href="/cookies"
            className="text-foreground underline underline-offset-4"
          >
            Cookie Policy
          </a>
          .
        </p>
      </Section>

      <Section title="9. Children's Privacy">
        <p>
          The Service is not directed to individuals under 16 years of age. We
          do not knowingly collect personal data from children. If you believe
          we have inadvertently collected such data, please contact us
          immediately.
        </p>
      </Section>

      <Section title="10. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. When we do, we
          will update the &ldquo;last updated&rdquo; date and notify you by
          email or through the Service if the changes are material.
        </p>
      </Section>

      <Section title="11. Contact">
        <p>
          If you have questions about this Privacy Policy, please contact us at:
        </p>
        <p>
          <a
            href="mailto:privacy@Invoze.com"
            className="text-foreground underline underline-offset-4"
          >
            privacy@Invoze.com
          </a>
        </p>
      </Section>
    </div>
  )
}
