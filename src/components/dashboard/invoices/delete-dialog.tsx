'use client'

import { Loader2 } from 'lucide-react'
import { useDeleteInvoice } from '@/hooks/invoices'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { InvoiceWithClient } from '@/types'

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: InvoiceWithClient
}

export function DeleteDialog({
  open,
  onOpenChange,
  invoice,
}: DeleteDialogProps) {
  const { deleteInvoice, isLoading, serverError } = useDeleteInvoice(() =>
    onOpenChange(false),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete invoice {invoice.number}?</DialogTitle>
          <DialogDescription>
            This will permanently delete invoice {invoice.number} for{' '}
            {invoice.client.name}. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {serverError && (
          <p className="text-destructive text-sm">{serverError}</p>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteInvoice(invoice.id)}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isLoading ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
