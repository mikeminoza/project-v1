'use client'

import { AlertCircle, UserPlus } from 'lucide-react'
import { useClientForm } from '@/hooks/clients'
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
    formState: { errors },
  } = form

  const isEdit = !!client

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-brand/10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg">
              <UserPlus className="text-brand h-4 w-4" />
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Jane Smith" {...register('name')} />
              {errors.name && <FieldError message={errors.name.message!} />}
            </div>

            <div className="space-y-1.5">
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

          <div className="border-border space-y-3 rounded-lg border p-3">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Optional details
            </p>
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
            </div>
            <div className="space-y-1.5">
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
              {isLoading ? 'Saving…' : isEdit ? 'Save changes' : 'Add client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
