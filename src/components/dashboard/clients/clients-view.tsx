'use client'

import { useState } from 'react'
import { Plus, Users, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ClientDialog } from './client-dialog'
import { DeleteDialog } from './delete-dialog'
import type { Client } from '@/types'

interface ClientsViewProps {
  clients: Client[]
}

export function ClientsView({ clients }: ClientsViewProps) {
  const [clientDialog, setClientDialog] = useState<{
    open: boolean
    client?: Client
  }>({ open: false })
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    client?: Client
  }>({ open: false })

  function openAdd() {
    setClientDialog({ open: true, client: undefined })
  }

  function openEdit(client: Client) {
    setClientDialog({ open: true, client })
  }

  function openDelete(client: Client) {
    setDeleteDialog({ open: true, client })
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-foreground text-lg font-semibold">Clients</h1>
          <p className="text-muted-foreground text-sm">
            {clients.length === 0
              ? 'No clients yet'
              : `${clients.length} client${clients.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <Button onClick={openAdd} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add client
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {clients.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
              <Users className="text-muted-foreground h-8 w-8" />
            </div>
            <div>
              <p className="text-foreground font-medium">No clients yet</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Add your first client to get started.
              </p>
            </div>
            <Button onClick={openAdd} variant="outline">
              <Plus className="h-4 w-4" />
              Add client
            </Button>
          </div>
        ) : (
          <div className="border-border overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border bg-muted/50 border-b">
                  <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                    Name
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                    Email
                  </th>
                  <th className="text-muted-foreground hidden px-4 py-3 text-left font-medium md:table-cell">
                    Company
                  </th>
                  <th className="text-muted-foreground hidden px-4 py-3 text-left font-medium lg:table-cell">
                    Phone
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {clients.map((client, i) => (
                  <tr
                    key={client.id}
                    className={
                      i < clients.length - 1 ? 'border-border border-b' : ''
                    }
                  >
                    <td className="text-foreground px-4 py-3 font-medium">
                      {client.name}
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {client.email}
                    </td>
                    <td className="text-muted-foreground hidden px-4 py-3 md:table-cell">
                      {client.company ?? '—'}
                    </td>
                    <td className="text-muted-foreground hidden px-4 py-3 lg:table-cell">
                      {client.phone ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(client)}
                          aria-label="Edit client"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openDelete(client)}
                          aria-label="Delete client"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ClientDialog
        key={clientDialog.client?.id ?? 'new'}
        open={clientDialog.open}
        onOpenChange={(open) => setClientDialog((prev) => ({ ...prev, open }))}
        client={clientDialog.client}
      />

      {deleteDialog.client && (
        <DeleteDialog
          open={deleteDialog.open}
          onOpenChange={(open) =>
            setDeleteDialog((prev) => ({ ...prev, open }))
          }
          client={deleteDialog.client}
        />
      )}
    </div>
  )
}
