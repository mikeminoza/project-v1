import { redirect } from 'next/navigation'
import { Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Logo } from '@/components/ui/logo'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/sign-in')

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/sign-in')
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined)?.split(' ')[0] ??
    user.email

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-border/50 border-b px-6 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Logo size={24} />
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground hidden text-sm sm:block">
              {user.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="max-w-sm">
          <div className="bg-brand/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
            <Zap className="text-brand h-7 w-7" />
          </div>
          <h1 className="text-foreground mb-3 text-2xl font-bold tracking-tight">
            Welcome{displayName ? `, ${displayName}` : ''}!
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your dashboard is on its way. Invoice management, automated
            reminders, and client tracking are coming soon.
          </p>
        </div>
      </main>
    </div>
  )
}
