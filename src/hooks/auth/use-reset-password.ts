'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/client'

export function useResetPassword() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirm: '' },
  })

  async function onSubmit(data: ResetPasswordValues) {
    setServerError(null)
    setIsLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    })

    if (error) {
      setServerError(error.message)
      setIsLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  function togglePassword() {
    setShowPassword((prev) => !prev)
  }

  function toggleConfirm() {
    setShowConfirm((prev) => !prev)
  }

  return {
    form,
    onSubmit,
    isLoading,
    serverError,
    showPassword,
    showConfirm,
    togglePassword,
    toggleConfirm,
  }
}
