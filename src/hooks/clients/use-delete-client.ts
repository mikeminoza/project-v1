'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useDeleteClient(onSuccess?: () => void) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  async function deleteClient(id: string) {
    setIsLoading(true)
    setServerError(null)

    const supabase = createClient()
    const { error } = await supabase.from('clients').delete().eq('id', id)

    setIsLoading(false)

    if (error) {
      if (error.message.includes('foreign key')) {
        setServerError(
          'This client has invoices and cannot be deleted. Remove their invoices first.',
        )
      } else {
        setServerError(error.message)
      }
      return
    }

    router.refresh()
    onSuccess?.()
  }

  return { deleteClient, isLoading, serverError }
}
