import Link from 'next/link'
import { ArrowLeft, MailCheck } from 'lucide-react'
import { FadeIn } from '@/components/ui/motion'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'

export default function VerifyEmailPage() {
  return (
    <FadeIn className="w-full max-w-sm text-center">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <Logo size={28} />
      </div>

      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="bg-brand/10 flex h-16 w-16 items-center justify-center rounded-full">
          <MailCheck className="text-brand h-8 w-8" />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-foreground mb-3 text-2xl font-bold tracking-tight">
        Check your inbox
      </h1>
      <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
        We sent a verification link to your email address. Click the link to
        activate your account. The link expires in 24 hours.
      </p>

      {/* Resend */}
      <Button variant="outline" className="w-full">
        Resend verification email
      </Button>

      {/* Back link */}
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
