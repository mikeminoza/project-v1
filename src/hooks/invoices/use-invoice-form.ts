'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { invoicesDb } from '@/lib/db'
import { invoiceSchema, type InvoiceValues } from '@/lib/validations/invoice'
import type { InvoiceWithClient } from '@/types'

export function newLineItem() {
  return {
    id: crypto.randomUUID(),
    description: '',
    quantity: 1,
    unit_price: 0,
  }
}

interface UseInvoiceFormOptions {
  invoice?: InvoiceWithClient
  nextNumber?: string
  defaultPaymentDetails?: string | null
  onSuccess?: () => void
}

export function useInvoiceForm({
  invoice,
  nextNumber = 'INV-001',
  defaultPaymentDetails,
  onSuccess,
}: UseInvoiceFormOptions = {}): {
  form: UseFormReturn<InvoiceValues>
  onSubmit: (data: InvoiceValues) => Promise<void>
  isLoading: boolean
  serverError: string | null
} {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // useState initializers run once — avoids calling Date.now() on every render
  const [today] = useState(() => new Date().toISOString().split('T')[0])
  const [defaultDue] = useState(
    () =>
      new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
  )

  const form = useForm<InvoiceValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      client_id: invoice?.client_id ?? '',
      number: invoice?.number ?? nextNumber,
      currency: invoice?.currency ?? 'USD',
      line_items:
        invoice?.line_items && invoice.line_items.length > 0
          ? invoice.line_items
          : [newLineItem()],
      issue_date: invoice?.issue_date ?? today,
      due_date: invoice?.due_date ?? defaultDue,
      status: invoice?.status ?? 'pending',
      notes: invoice?.notes ?? '',
      payment_details: invoice?.payment_details ?? defaultPaymentDetails ?? '',
      logo_url: invoice?.logo_url ?? '',
    },
  })

  async function onSubmit(data: InvoiceValues) {
    setIsLoading(true)
    setServerError(null)

    const amount = data.line_items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0,
    )

    const supabase = createClient()
    const payload = {
      client_id: data.client_id,
      number: data.number,
      amount,
      line_items: data.line_items,
      currency: data.currency,
      issue_date: data.issue_date,
      due_date: data.due_date,
      status: data.status,
      notes: data.notes || null,
      payment_details: data.payment_details || null,
      logo_url: data.logo_url || null,
    }

    try {
      if (invoice) {
        await invoicesDb.update(supabase, invoice.id, payload)
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')
        await invoicesDb.create(supabase, user.id, payload)
      }
      router.refresh()
      onSuccess?.()
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Something went wrong',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return { form, onSubmit, isLoading, serverError }
}
