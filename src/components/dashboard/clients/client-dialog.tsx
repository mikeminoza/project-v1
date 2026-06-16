'use client'

import { useClientForm } from '@/hooks/clients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import type { Client } from '@/types'

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{client ? 'Edit client' : 'Add client'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Jane Smith" {...register('name')} />
              {errors.name && (
                <p className="text-destructive text-xs">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@studio.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-destructive text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company">
                Company{' '}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="company"
                placeholder="Acme Inc."
                {...register('company')}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">
                Phone{' '}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 555 000 0000"
                {...register('phone')}
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="address">
                Address{' '}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="address"
                placeholder="123 Main St, City"
                {...register('address')}
              />
            </div>
          </div>

          {serverError && (
            <p className="text-destructive text-sm">{serverError}</p>
          )}

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
              {isLoading ? 'Saving…' : 'Save client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
