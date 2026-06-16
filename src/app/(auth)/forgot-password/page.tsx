import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { FadeIn } from '@/components/ui/motion'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  return (
    <FadeIn className="w-full max-w-sm">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <Logo size={28} />
      </div>

      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Forgot your password?
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {/* Form */}
      <form className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="alex@studio.com"
            autoComplete="email"
          />
        </div>

        <Button type="submit" className="mt-2 w-full rounded-full">
          Send reset link
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {/* Back link */}
      <div className="mt-6 text-center">
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
