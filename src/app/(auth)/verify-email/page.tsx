'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, MailCheck } from 'lucide-react'
import { FadeIn } from '@/components/ui/motion'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { useVerifyEmail } from '@/hooks/auth'

function VerifyEmailContent() {
  const { email, status, resend } = useVerifyEmail()

  return (
    <FadeIn className="w-full max-w-sm text-center">
      <div className="mb-8 flex justify-center">
        <Logo size={28} />
      </div>

      <div className="mb-6 flex justify-center">
        <div className="bg-brand/10 flex h-16 w-16 items-center justify-center rounded-full">
          <MailCheck className="text-brand h-8 w-8" />
        </div>
      </div>

      <h1 className="text-foreground mb-3 text-2xl font-bold tracking-tight">
        Check your inbox
      </h1>
      <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
        We sent a verification link to{' '}
        {email ? (
          <strong className="text-foreground">{email}</strong>
        ) : (
          'your email address'
        )}
        . Click it to activate your account. It expires in 24 hours.
      </p>

      {status === 'sent' ? (
        <p className="text-brand text-sm font-medium">
          Email resent — check your inbox.
        </p>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={resend}
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'Sending…' : 'Resend verification email'}
        </Button>
      )}

      {status === 'error' && (
        <p className="text-destructive mt-2 text-sm">
          Something went wrong. Please try again.
        </p>
      )}

      <div className="mt-6">
        <Link
          href="/sign-in"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </div>
    </FadeIn>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  )
}
