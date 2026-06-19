import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function NotFound() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const href = user ? '/dashboard' : '/'
  const label = user ? 'Back to dashboard' : 'Back to home'

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-muted-foreground/20 font-mono text-8xl font-bold tracking-tight select-none sm:text-9xl">
        404
      </p>
      <h1 className="text-foreground mt-6 text-xl font-semibold sm:text-2xl">
        Page not found
      </h1>
      <p className="text-muted-foreground mt-2 max-w-xs text-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href={href}
        className="border-border text-foreground hover:bg-muted mt-8 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Link>
    </div>
  )
}
