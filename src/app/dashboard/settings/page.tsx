import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { profilesDb } from '@/lib/db'
import { BusinessProfileForm } from '@/components/dashboard/settings/business-profile-form'
import { EmailTemplatesForm } from '@/components/dashboard/settings/email-templates-form'

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
          Manage your business profile and email templates
        </p>
      </div>

      <BusinessProfileForm profile={profile} userId={user.id} />

      <div className="border-border mt-10 border-t pt-10">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Reminder templates</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Customize the email sent at each escalation level. Use variables to
            personalize each message.
          </p>
        </div>
        <EmailTemplatesForm initialTemplates={profile.email_templates ?? {}} />
      </div>
    </div>
  )
}
