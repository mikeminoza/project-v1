'use client'

import { useState } from 'react'
import { Bell, CheckCircle, Loader2, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { sendReminderAction } from '@/actions/send-reminder'

type State = 'idle' | 'loading' | 'sent' | 'error'

interface SendReminderButtonProps {
  invoiceId: string
  variant?: 'button' | 'menu-item'
}

export function SendReminderButton({
  invoiceId,
  variant = 'button',
}: SendReminderButtonProps) {
  const router = useRouter()
  const [state, setState] = useState<State>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleSend(e: React.MouseEvent) {
    e.stopPropagation()
    setState('loading')
    setErrorMsg(null)

    const result = await sendReminderAction(invoiceId)

    if (result.success) {
      setState('sent')
      router.refresh()
      setTimeout(() => setState('idle'), 3000)
    } else {
      setState('error')
      setErrorMsg(result.error ?? 'Failed to send')
      setTimeout(() => setState('idle'), 4000)
    }
  }

  if (variant === 'menu-item') {
    const icon =
      state === 'loading' ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : state === 'sent' ? (
        <CheckCircle className="h-4 w-4 text-emerald-500" />
      ) : state === 'error' ? (
        <XCircle className="text-destructive h-4 w-4" />
      ) : (
        <Bell className="h-4 w-4" />
      )

    const label =
      state === 'loading'
        ? 'Sending…'
        : state === 'sent'
          ? 'Sent!'
          : state === 'error'
            ? (errorMsg ?? 'Error')
            : 'Send reminder'

    return (
      <button
        onClick={handleSend}
        disabled={state === 'loading'}
        className="focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none disabled:pointer-events-none disabled:opacity-50"
      >
        {icon}
        {label}
      </button>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant={state === 'sent' ? 'default' : 'outline'}
        onClick={handleSend}
        disabled={state === 'loading'}
        className={
          state === 'sent' ? 'bg-emerald-600 hover:bg-emerald-700' : ''
        }
      >
        {state === 'loading' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : state === 'sent' ? (
          <CheckCircle className="h-4 w-4" />
        ) : state === 'error' ? (
          <XCircle className="h-4 w-4" />
        ) : (
          <Bell className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">
          {state === 'loading'
            ? 'Sending…'
            : state === 'sent'
              ? 'Reminder sent!'
              : state === 'error'
                ? 'Failed'
                : 'Send reminder'}
        </span>
      </Button>
      {state === 'error' && errorMsg && (
        <p className="text-destructive text-xs">{errorMsg}</p>
      )}
    </div>
  )
}
