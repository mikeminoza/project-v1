'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, type SignUpValues } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/client'

export function useSignUp() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  async function onSubmit(data: SignUpValues) {
    setServerError(null)
    setIsLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.name } },
    })

    if (error) {
      setServerError(error.message)
      setIsLoading(false)
      return
    }

    router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
  }

  function togglePassword() {
    setShowPassword((prev) => !prev)
  }

  return {
    form,
    onSubmit,
    isLoading,
    serverError,
    showPassword,
    togglePassword,
  }
}
