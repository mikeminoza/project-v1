import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { invoicesDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 503 },
    )
  }

  const body = await request.json()
  const { portalToken } = body as { portalToken: string }
  if (!portalToken) {
    return NextResponse.json({ error: 'Missing portal token' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const invoice = await invoicesDb.getByPortalToken(supabase, portalToken)

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
  }
  if (invoice.status === 'paid') {
    return NextResponse.json({ error: 'Invoice already paid' }, { status: 409 })
  }
  if (invoice.status === 'draft') {
    return NextResponse.json(
      { error: 'Invoice is not yet finalized' },
      { status: 400 },
    )
  }

  const stripe = getStripe()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: invoice.client.email,
    line_items: [
      {
        price_data: {
          currency: invoice.currency.toLowerCase(),
          unit_amount: Math.round(Number(invoice.amount) * 100),
          product_data: {
            name: `Invoice ${invoice.number}`,
            ...(invoice.notes ? { description: invoice.notes } : {}),
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      invoice_id: invoice.id,
      portal_token: portalToken,
    },
    success_url: `${appUrl}/pay/${portalToken}?paid=1`,
    cancel_url: `${appUrl}/pay/${portalToken}`,
  })

  return NextResponse.json({ url: session.url })
}
