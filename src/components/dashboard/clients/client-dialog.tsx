'use client'

import { AlertCircle, Loader2 } from 'lucide-react'
import { useClientForm } from '@/hooks/clients'
import { getAvatar } from '@/lib/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Client } from '@/types'

function FieldError({ message }: { message: string }) {
  return (
    <p className="text-destructive flex items-center gap-1 text-xs">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      {message}
    </p>
  )
}

interface ClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: Client
}

export function ClientDialog({
  open,
  onOpenChange,
  client,
}: ClientDialogProps) {
  const { form, onSubmit, isLoading, serverError } = useClientForm({
    client,
    onSuccess: () => onOpenChange(false),
  })
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form

  const isEdit = !!client
  const { initials, color } = getAvatar(watch('name'))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {/* Live avatar — updates as user types the name */}
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${color}`}
            >
              {initials}
            </div>
            <div>
              <DialogTitle>{isEdit ? 'Edit client' : 'New client'}</DialogTitle>
              <DialogDescription>
                {isEdit
                  ? 'Update the details for this client.'
                  : 'Add a new client to your workspace.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Required fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Jane Smith" {...register('name')} />
              {errors.name && <FieldError message={errors.name.message!} />}
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@studio.com"
                {...register('email')}
              />
              {errors.email && <FieldError message={errors.email.message!} />}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="border-border h-px flex-1 border-t" />
            <span className="text-muted-foreground text-xs">Optional</span>
            <div className="border-border h-px flex-1 border-t" />
          </div>

          {/* Optional fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="Acme Inc."
                {...register('company')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 555 0000"
                {...register('phone')}
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="123 Main St, City"
                {...register('address')}
              />
            </div>
          </div>

          {serverError && <FieldError message={serverError} />}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isLoading ? 'Saving…' : isEdit ? 'Save changes' : 'Add client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
