'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { clientsDb } from '@/lib/db'
import { clientSchema, type ClientValues } from '@/lib/validations/client'
import type { Client } from '@/types'

interface UseClientFormOptions {
  client?: Client
  onSuccess?: () => void
}

export function useClientForm({
  client,
  onSuccess,
}: UseClientFormOptions = {}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<ClientValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client?.name ?? '',
      email: client?.email ?? '',
      phone: client?.phone ?? '',
      company: client?.company ?? '',
      address: client?.address ?? '',
    },
  })

  async function onSubmit(data: ClientValues) {
    setIsLoading(true)
    setServerError(null)

    const supabase = createClient()
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      address: data.address || null,
    }

    try {
      if (client) {
        await clientsDb.update(supabase, client.id, payload)
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')
        await clientsDb.create(supabase, user.id, payload)
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
