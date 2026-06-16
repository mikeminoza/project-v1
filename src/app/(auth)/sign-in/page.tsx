'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { FadeIn } from '@/components/ui/motion'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GoogleIcon } from '@/components/auth/google-icon'

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <FadeIn className="w-full max-w-sm">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <Logo size={28} />
      </div>

      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Sign in to your Invoq account.
        </p>
      </div>

      {/* Google OAuth */}
      <Button variant="outline" className="w-full gap-2">
        <GoogleIcon />
        Continue with Google
      </Button>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs">
          or continue with email
        </span>
        <div className="bg-border h-px flex-1" />
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
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
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
        </div>

        <Button type="submit" className="mt-2 w-full rounded-full">
          Sign in
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {/* Sign up link */}
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
