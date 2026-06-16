'use client'

import { useState } from 'react'
import { Plus, Users, Pencil, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ClientDialog } from './client-dialog'
import { DeleteDialog } from './delete-dialog'
import type { Client } from '@/types'

const AVATAR_COLORS = [
  'bg-blue-500/15 text-blue-400',
  'bg-violet-500/15 text-violet-400',
  'bg-emerald-500/15 text-emerald-400',
  'bg-orange-500/15 text-orange-400',
  'bg-pink-500/15 text-pink-400',
  'bg-cyan-500/15 text-cyan-400',
  'bg-yellow-500/15 text-yellow-400',
]

function getAvatar(name: string) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
  return { initials, color }
}

interface ClientsViewProps {
  clients: Client[]
}

export function ClientsView({ clients }: ClientsViewProps) {
  const [search, setSearch] = useState('')
  const [clientDialog, setClientDialog] = useState<{
    open: boolean
    client?: Client
  }>({ open: false })
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    client?: Client
  }>({ open: false })

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.company?.toLowerCase().includes(q) ?? false)
    )
  })

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
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add client
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {clients.length === 0 ? (
          /* Empty state */
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
          <div className="space-y-4">
            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search clients…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
              <div className="text-muted-foreground py-12 text-center text-sm">
                No clients match &quot;{search}&quot;
              </div>
            ) : (
              <div className="border-border overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-border bg-muted/50 border-b">
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wide uppercase">
                        Client
                      </th>
                      <th className="text-muted-foreground hidden px-4 py-3 text-left text-xs font-medium tracking-wide uppercase md:table-cell">
                        Email
                      </th>
                      <th className="text-muted-foreground hidden px-4 py-3 text-left text-xs font-medium tracking-wide uppercase lg:table-cell">
                        Phone
                      </th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-border divide-y">
                    {filtered.map((client) => {
                      const { initials, color } = getAvatar(client.name)
                      return (
                        <tr
                          key={client.id}
                          className="hover:bg-muted/40 group transition-colors"
                        >
                          {/* Name + company */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${color}`}
                              >
                                {initials}
                              </div>
                              <div>
                                <p className="text-foreground font-medium">
                                  {client.name}
                                </p>
                                {client.company && (
                                  <p className="text-muted-foreground text-xs">
                                    {client.company}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="text-muted-foreground hidden px-4 py-3 md:table-cell">
                            {client.email}
                          </td>

                          <td className="text-muted-foreground hidden px-4 py-3 lg:table-cell">
                            {client.phone ?? '—'}
                          </td>

                          {/* Actions — visible on row hover */}
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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
                                className="hover:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
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
