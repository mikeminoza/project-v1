import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { profilesDb } from '@/lib/db'
import { BusinessProfileForm } from '@/components/dashboard/settings/business-profile-form'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const profile = await profilesDb.getById(supabase, user.id)
  if (!profile) redirect('/sign-in')

  return (
    <div className="mx-auto max-w-2xl p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Your business profile appears on all invoices
        </p>
      </div>
      <BusinessProfileForm profile={profile} userId={user.id} />
    </div>
  )
}
