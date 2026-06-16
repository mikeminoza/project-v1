'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
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

    const supabase = createSupabaseClient()

    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      address: data.address || null,
    }

    let error

    if (client) {
      ;({ error } = await supabase
        .from('clients')
        .update(payload)
        .eq('id', client.id))
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setServerError('Not authenticated')
        setIsLoading(false)
        return
      }
      ;({ error } = await supabase
        .from('clients')
        .insert({ ...payload, user_id: user.id }))
    }

    setIsLoading(false)

    if (error) {
      setServerError(error.message)
      return
    }

    router.refresh()
    onSuccess?.()
  }

  return { form, onSubmit, isLoading, serverError }
}
