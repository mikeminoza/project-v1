'use client'

import Link from 'next/link'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { FadeIn } from '@/components/ui/motion'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSignIn } from '@/hooks/auth'

export default function SignInPage() {
  const {
    form,
    onSubmit,
    isLoading,
    serverError,
    showPassword,
    togglePassword,
  } = useSignIn()
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

      <div className="mb-8 text-center">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Sign in to your Invoze account.
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
            <p className="text-destructive text-xs">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Your password"
              autoComplete="current-password"
              className="pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={togglePassword}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive text-xs">
              {errors.password.message}
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
          {isLoading ? 'Signing in…' : 'Sign in'}
          {!isLoading && <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link
          href="/sign-up"
          className="text-foreground hover:text-brand font-medium transition-colors"
        >
          Sign up free
        </Link>
      </p>
    </FadeIn>
  )
}
