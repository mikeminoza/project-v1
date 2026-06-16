import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/sign-in')

  return (
    <div className="bg-background flex h-screen flex-col overflow-hidden md:flex-row">
      <Sidebar user={user} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
