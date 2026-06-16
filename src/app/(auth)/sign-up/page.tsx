'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { FadeIn } from '@/components/ui/motion'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GoogleIcon } from '@/components/auth/google-icon'
import { createClient } from '@/lib/supabase/client'

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    router.push(`/verify-email?email=${encodeURIComponent(email)}`)
  }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <FadeIn className="w-full max-w-sm">
      <div className="mb-8 flex justify-center">
        <Logo size={28} />
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Create your account
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Start getting paid on time, automatically.
        </p>
      </div>

      <Button
        variant="outline"
        className="w-full gap-2"
        type="button"
        onClick={handleGoogle}
      >
        <GoogleIcon />
        Continue with Google
      </Button>

      <div className="my-6 flex items-center gap-3">
        <div className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs">
          or continue with email
        </span>
        <div className="bg-border h-px flex-1" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Alex Johnson"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="alex@studio.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
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

        {error && <p className="text-destructive text-sm">{error}</p>}

        <Button
          type="submit"
          className="mt-2 w-full rounded-full"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account…' : 'Create account'}
          {!isLoading && <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        Already have an account?{' '}
        <Link
          href="/sign-in"
          className="text-foreground hover:text-brand font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>

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
  )
}
