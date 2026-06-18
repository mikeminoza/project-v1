import { Webhook } from 'svix'
import { createAdminClient } from '@/lib/supabase/admin'
import { remindersDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

type ResendEmailEvent = {
  type: 'email.opened' | 'email.clicked' | string
  data: {
    email_id: string
    [key: string]: unknown
  }
}

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET

  const body = await request.text()

  if (secret) {
    const svixId = request.headers.get('svix-id')
    const svixTimestamp = request.headers.get('svix-timestamp')
    const svixSignature = request.headers.get('svix-signature')

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response('Missing svix headers', { status: 400 })
    }

    try {
      const wh = new Webhook(secret)
      wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      })
    } catch {
      return new Response('Invalid signature', { status: 401 })
    }
  }

  let event: ResendEmailEvent
  try {
    event = JSON.parse(body) as ResendEmailEvent
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const { type, data } = event
  if (type !== 'email.opened' && type !== 'email.clicked') {
    return new Response('OK', { status: 200 })
  }

  const resendEmailId = data?.email_id
  if (!resendEmailId) {
    return new Response('Missing email_id', { status: 400 })
  }

  try {
    const supabase = createAdminClient()
    const reminder = await remindersDb.getByResendEmailId(
      supabase,
      resendEmailId,
    )

    if (!reminder) {
      return new Response('OK', { status: 200 })
    }

    if (type === 'email.opened') {
      await remindersDb.markOpened(supabase, reminder.id)
    } else {
      await remindersDb.markClicked(supabase, reminder.id)
    }

    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error('[webhook/resend]', err)
    return new Response('Internal error', { status: 500 })
  }
}
