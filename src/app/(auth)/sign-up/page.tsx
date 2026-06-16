'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { FadeIn } from '@/components/ui/motion'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <FadeIn className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo size={28} />
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Create your account
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Start getting paid on time, automatically.
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
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Alex Johnson"
              autoComplete="name"
            />
          </div>

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
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
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
            Create account
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* Sign in link */}
        <p className="text-muted-foreground mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="text-foreground hover:text-brand font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>

        {/* Terms */}
        <p className="text-muted-foreground mt-8 text-center text-xs leading-relaxed">
          By creating an account you agree to our{' '}
          <Link
            href="/terms"
            className="hover:text-foreground underline underline-offset-4 transition-colors"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="hover:text-foreground underline underline-offset-4 transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </FadeIn>
    </div>
  )
}
