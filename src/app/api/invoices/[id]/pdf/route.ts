import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { createClient } from '@/lib/supabase/server'
import { invoicesDb, profilesDb } from '@/lib/db'
import { InvoiceDocument } from '@/lib/pdf/invoice-document'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const [invoice, profile] = await Promise.all([
    invoicesDb.getById(supabase, id),
    profilesDb.getById(supabase, user.id),
  ])

  if (!invoice) {
    return new Response('Not found', { status: 404 })
  }

  if (invoice.user_id !== user.id) {
    return new Response('Forbidden', { status: 403 })
  }

  const element = React.createElement(InvoiceDocument, {
    invoice,
    profile,
  }) as React.ReactElement

  const buffer = await renderToBuffer(
    element as Parameters<typeof renderToBuffer>[0],
  )

  const filename = `${invoice.number.replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf`

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
