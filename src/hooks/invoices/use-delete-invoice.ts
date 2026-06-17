'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { invoicesDb } from '@/lib/db'

export function useDeleteInvoice(onSuccess?: () => void) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  async function deleteInvoice(id: string) {
    setIsLoading(true)
    setServerError(null)

    try {
      const supabase = createClient()
      await invoicesDb.remove(supabase, id)
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

  return { deleteInvoice, isLoading, serverError }
}
