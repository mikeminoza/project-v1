'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { FadeIn } from '@/components/ui/motion'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForgotPassword } from '@/hooks/use-forgot-password'

export default function ForgotPasswordPage() {
  const { form, onSubmit, isLoading, serverError, sentEmail } =
    useForgotPassword()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  return (
    <FadeIn className="w-full max-w-sm">
      <div className="mb-8 flex justify-center">
        <Logo size={28} />
      </div>

      {sentEmail ? (
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-brand/10 flex h-16 w-16 items-center justify-center rounded-full">
              <CheckCircle2 className="text-brand h-8 w-8" />
            </div>
          </div>
          <h1 className="text-foreground mb-3 text-2xl font-bold tracking-tight">
            Check your inbox
          </h1>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            We sent a reset link to{' '}
            <strong className="text-foreground">{sentEmail}</strong>. Click it
            to set a new password.
          </p>
          <Link
            href="/sign-in"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8 text-center">
            <h1 className="text-foreground text-2xl font-bold tracking-tight">
              Forgot your password?
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="alex@studio.com"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-destructive text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>

            {serverError && (
              <p className="text-destructive text-sm">{serverError}</p>
            )}

            <Button
              type="submit"
              className="mt-2 w-full rounded-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending…' : 'Send reset link'}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/sign-in"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>
          </div>
        </>
      )}
    </FadeIn>
  )
}
