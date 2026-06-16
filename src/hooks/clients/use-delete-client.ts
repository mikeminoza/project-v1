'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { clientsDb } from '@/lib/db'

export function useDeleteClient(onSuccess?: () => void) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  async function deleteClient(id: string) {
    setIsLoading(true)
    setServerError(null)

    try {
      const supabase = createClient()
      await clientsDb.remove(supabase, id)
      router.refresh()
      onSuccess?.()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong'
      setServerError(
        message.includes('foreign key')
          ? 'This client has invoices and cannot be deleted. Remove their invoices first.'
          : message,
      )
    } finally {
      setIsLoading(false)
    }
  }

  return { deleteClient, isLoading, serverError }
}
