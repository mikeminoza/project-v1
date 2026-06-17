'use client'

import { useState, useTransition } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import { markInvoicePaidAction } from '@/actions/mark-invoice-paid'

export function MarkPaidButton({
  portalToken,
  businessName,
}: {
  portalToken: string
  businessName: string
}) {
  const [isPending, startTransition] = useTransition()
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setError(null)
    startTransition(async () => {
      const result = await markInvoicePaidAction(portalToken)
      if (result.success) {
        setDone(true)
      } else if (result.error === 'already_paid') {
        setDone(true)
      } else {
        setError(result.error ?? 'Something went wrong. Please try again.')
      }
    })
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl bg-emerald-50 px-6 py-5 text-center">
        <CheckCircle className="h-8 w-8 text-emerald-500" />
        <p className="font-semibold text-emerald-800">Thank you!</p>
        <p className="text-sm text-emerald-700">
          We&apos;ve notified {businessName} that your payment is on the way.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-60"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPending ? 'Confirming…' : "I've sent payment"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-center text-xs text-gray-400">
        This will notify {businessName} that payment is on its way.
      </p>
    </div>
  )
}
