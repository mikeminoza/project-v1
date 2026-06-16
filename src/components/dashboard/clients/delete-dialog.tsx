'use client'

import { useDeleteClient } from '@/hooks/clients'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import type { Client } from '@/types'

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client
}

export function DeleteDialog({
  open,
  onOpenChange,
  client,
}: DeleteDialogProps) {
  const { deleteClient, isLoading, serverError } = useDeleteClient(() =>
    onOpenChange(false),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete {client.name}?</DialogTitle>
          <DialogDescription>
            This will permanently delete this client. Any linked invoices must
            be removed first.
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
            onClick={() => deleteClient(client.id)}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
