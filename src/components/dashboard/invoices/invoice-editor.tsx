'use client'

import { useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  Download,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  MousePointerClick,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { Controller, useFieldArray } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { useInvoiceForm, newLineItem } from '@/hooks/invoices'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ToneBadge } from './tone-badge'
import { SendReminderButton } from './send-reminder-button'
import type { Client, InvoiceWithClient, UserProfile } from '@/types'

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
]

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SGD', 'JPY']

function FieldError({ message }: { message: string }) {
  return (
    <p className="text-destructive flex items-center gap-1 text-xs">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      {message}
    </p>
  )
}

function fmt(amount: number, currency: string) {
  if (isNaN(amount)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 2,
  }).format(amount)
}

function fmtDate(dateStr: string) {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

export interface InvoiceEditorProps {
  invoice?: InvoiceWithClient
  clients: Client[]
  nextNumber: string
  userEmail: string
  userName?: string
  userProfile?: UserProfile | null
  lastReminderSentAt?: string | null
  lastReminderOpenedAt?: string | null
  lastReminderClickedAt?: string | null
}

export function InvoiceEditor({
  invoice,
  clients,
  nextNumber,
  userEmail,
  userName,
  userProfile,
  lastReminderSentAt,
  lastReminderOpenedAt,
  lastReminderClickedAt,
}: InvoiceEditorProps) {
  const router = useRouter()
  const isEdit = !!invoice
  const [showPreview, setShowPreview] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const { form, onSubmit, isLoading, serverError } = useInvoiceForm({
    invoice,
    nextNumber,
    defaultPaymentDetails: userProfile?.default_payment_details,
    onSuccess: () => router.push('/dashboard/invoices'),
  })

  const {
    register,
    control,
    formState: { errors },
    watch,
    setValue,
  } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'line_items',
  })

  // Invoice logo upload
  const logoInputRef = useRef<HTMLInputElement>(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null)

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoUploading(true)
    setLogoUploadError(null)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
      const path = `${user.id}/invoices/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('logos')
        .upload(path, file, { upsert: true, contentType: file.type })
      if (uploadErr) throw new Error(uploadErr.message)
      const {
        data: { publicUrl },
      } = supabase.storage.from('logos').getPublicUrl(path)
      setValue('logo_url', publicUrl)
    } catch (err) {
      setLogoUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLogoUploading(false)
      if (logoInputRef.current) logoInputRef.current.value = ''
    }
  }

  const watchedValues = watch()
  const selectedClient = clients.find((c) => c.id === watchedValues.client_id)

  const lineItems = watchedValues.line_items ?? []
  const total = lineItems.reduce(
    (sum, item) =>
      sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
    0,
  )

  const previewInvoice = {
    ...watchedValues,
    id: invoice?.id ?? '',
    user_id: invoice?.user_id ?? '',
    portal_token: invoice?.portal_token ?? '',
    auto_reminder: invoice?.auto_reminder ?? true,
    created_at: invoice?.created_at ?? '',
    updated_at: invoice?.updated_at ?? '',
    amount: total,
    notes: watchedValues.notes || null,
    payment_details: watchedValues.payment_details || null,
    logo_url: watchedValues.logo_url || null,
    line_items: lineItems,
    client: selectedClient ?? {
      id: '',
      user_id: '',
      name: '',
      email: '',
      phone: null,
      company: null,
      address: null,
      created_at: '',
      updated_at: '',
    },
  } satisfies InvoiceWithClient

  function esc(s: string | null | undefined) {
    if (!s) return ''
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  function handleDownload() {
    if (isEdit && invoice) {
      window.location.href = `/api/invoices/${invoice.id}/pdf`
      return
    }
    const lineItemRows = lineItems
      .map(
        (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;">${esc(item.description) || '—'}</td>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-size:14px;">${Number(item.quantity) || 0}</td>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-size:14px;">${fmt(Number(item.unit_price) || 0, watchedValues.currency)}</td>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-size:14px;font-variant-numeric:tabular-nums;">${fmt((Number(item.quantity) || 0) * (Number(item.unit_price) || 0), watchedValues.currency)}</td>
        </tr>`,
      )
      .join('')

    const notesHtml = watchedValues.notes?.trim()
      ? `<div style="margin-top:20px;">
           <p style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#9ca3af;margin-bottom:6px;">Notes</p>
           <p style="font-size:13px;color:#374151;white-space:pre-wrap;">${esc(watchedValues.notes)}</p>
         </div>`
      : ''

    const paymentHtml = watchedValues.payment_details?.trim()
      ? `<div style="margin-top:20px;">
           <p style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#9ca3af;margin-bottom:6px;">Payment details</p>
           <p style="font-size:13px;color:#374151;white-space:pre-wrap;">${esc(watchedValues.payment_details)}</p>
         </div>`
      : ''

    const clientHtml = selectedClient
      ? `<p style="font-weight:600;font-size:15px;color:#111827;">${esc(selectedClient.name)}</p>
         ${selectedClient.company ? `<p style="font-size:13px;color:#6b7280;">${esc(selectedClient.company)}</p>` : ''}
         <p style="font-size:13px;color:#6b7280;">${esc(selectedClient.email)}</p>`
      : '<p style="font-size:13px;color:#9ca3af;font-style:italic;">—</p>'

    const p = userProfile
    const fromName = p?.business_name || userName || userEmail
    const fromSubName = p?.business_name
      ? userName || userEmail
      : userName
        ? userEmail
        : ''
    const effectiveLogo = watchedValues.logo_url || p?.logo_url
    const logoHtml = effectiveLogo
      ? `<img src="${esc(effectiveLogo)}" alt="Logo" style="height:40px;max-width:128px;object-fit:contain;margin-bottom:8px;display:block;">`
      : ''
    const fromHtml = `
      ${logoHtml}
      <p style="font-weight:600;font-size:15px;color:#111827;">${esc(fromName)}</p>
      ${fromSubName ? `<p style="font-size:13px;color:#6b7280;">${esc(fromSubName)}</p>` : ''}
      ${p?.business_address ? `<p style="font-size:12px;color:#6b7280;white-space:pre-line;margin-top:2px;">${esc(p.business_address)}</p>` : ''}
      ${p?.business_phone || p?.business_website ? `<p style="font-size:12px;color:#6b7280;margin-top:2px;">${esc([p?.business_phone, p?.business_website].filter(Boolean).join(' · '))}</p>` : ''}
      ${p?.tax_id ? `<p style="font-size:12px;color:#6b7280;margin-top:2px;">Tax ID: ${esc(p.tax_id)}</p>` : ''}
    `

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${esc(watchedValues.number) || 'INV'}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,-apple-system,sans-serif;background:#f9fafb;color:#111827}
    .page{max-width:680px;margin:40px auto;background:#fff;border-radius:12px;padding:48px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
    @media print{body{background:#fff}.page{margin:0;box-shadow:none;border-radius:0;padding:32px}}
    table{width:100%;border-collapse:collapse}
    th{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#9ca3af;font-weight:500;padding-bottom:8px;border-bottom:1px solid #e5e7eb}
    th:not(:first-child){text-align:right}
  </style>
</head>
<body>
  <div class="page">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;">
      <span style="font-size:28px;font-weight:700;color:#d1d5db;letter-spacing:-.02em;text-transform:uppercase;">Invoice</span>
      <span style="font-family:monospace;font-size:15px;font-weight:600;color:#111827;">${esc(watchedValues.number) || 'INV-001'}</span>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px;">
      <div>
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#9ca3af;margin-bottom:6px;">From</p>
        ${fromHtml}
      </div>
      <div>
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#9ca3af;margin-bottom:6px;">Bill to</p>
        ${clientHtml}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px;">
      <div>
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#9ca3af;margin-bottom:6px;">Issue date</p>
        <p style="font-size:14px;color:#374151;">${fmtDate(watchedValues.issue_date)}</p>
      </div>
      <div>
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#9ca3af;margin-bottom:6px;">Due date</p>
        <p style="font-size:14px;color:#374151;">${fmtDate(watchedValues.due_date)}</p>
      </div>
    </div>

    <hr style="border:none;border-top:1px solid #e5e7eb;margin-bottom:16px;">

    <table>
      <thead>
        <tr>
          <th style="text-align:left;">Description</th>
          <th>Qty</th>
          <th>Unit price</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>${lineItemRows}</tbody>
    </table>

    <div style="display:flex;justify-content:space-between;padding:14px 0;font-weight:700;font-size:16px;color:#111827;">
      <span>Total due</span>
      <span style="font-variant-numeric:tabular-nums;">${fmt(total, watchedValues.currency)}</span>
    </div>

    <hr style="border:none;border-top:1px solid #e5e7eb;">
    ${notesHtml}
    ${paymentHtml}
  </div>
  <script>setTimeout(function(){window.print()},200)</script>
</body>
</html>`

    const win = window.open('', '_blank', 'width=900,height=700')
    if (!win) return
    win.document.write(html)
    win.document.close()
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Sticky header */}
      <header className="border-border flex flex-shrink-0 items-center justify-between border-b px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            onClick={() => router.push('/dashboard/invoices')}
            aria-label="Back to invoices"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-foreground truncate font-semibold">
            {isEdit ? `Edit ${invoice.number}` : 'New invoice'}
          </span>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          {/* Preview toggle — mobile only */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setShowPreview((v) => !v)}
            aria-label={showPreview ? 'Show form' : 'Show preview'}
          >
            {showPreview ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDownload}
            aria-label="Download PDF"
          >
            <Download className="h-4 w-4" />
          </Button>
          {isEdit &&
            (invoice.status === 'pending' || invoice.status === 'overdue') && (
              <SendReminderButton invoiceId={invoice.id} />
            )}
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/invoices')}
            className="hidden sm:inline-flex"
          >
            Cancel
          </Button>
          <Button type="submit" form="invoice-form" disabled={isLoading}>
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span className="sm:hidden">{isEdit ? 'Save' : 'Create'}</span>
            <span className="hidden sm:inline">
              {isEdit ? 'Save changes' : 'Create invoice'}
            </span>
          </Button>
        </div>
      </header>

      {/* Last reminder banner */}
      {lastReminderSentAt && (
        <div className="border-border bg-muted/40 text-muted-foreground flex items-center gap-2 border-b px-4 py-2 text-xs">
          <span>
            Last reminder sent{' '}
            {formatDistanceToNow(parseISO(lastReminderSentAt), {
              addSuffix: true,
            })}
          </span>
          {lastReminderClickedAt ? (
            <span className="ml-1 flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <MousePointerClick className="h-3 w-3" />
              Clicked
            </span>
          ) : lastReminderOpenedAt ? (
            <span className="ml-1 flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <Eye className="h-3 w-3" />
              Opened
            </span>
          ) : null}
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — form */}
        <aside
          className={`border-border w-full flex-shrink-0 overflow-y-auto border-r md:flex md:w-[440px] md:flex-col ${showPreview ? 'hidden' : 'flex flex-col'}`}
        >
          <form
            id="invoice-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 p-6"
          >
            {/* Logo upload */}
            <div className="flex items-center gap-3">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleLogoUpload}
                className="hidden"
              />
              {watchedValues.logo_url ? (
                <div className="relative flex-shrink-0">
                  <img
                    src={watchedValues.logo_url}
                    alt="Invoice logo"
                    className="border-border h-12 max-w-28 rounded-lg border object-contain p-0.5"
                  />
                  <button
                    type="button"
                    onClick={() => setValue('logo_url', '')}
                    className="border-border bg-background text-muted-foreground hover:text-foreground absolute -top-1.5 -right-1.5 rounded-full border p-0.5"
                    aria-label="Remove logo"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={logoUploading}
                  className="border-border text-muted-foreground hover:border-brand hover:text-foreground flex h-12 w-20 flex-shrink-0 items-center justify-center rounded-lg border-2 border-dashed transition-colors disabled:opacity-50"
                >
                  {logoUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImagePlus className="h-4 w-4" />
                  )}
                </button>
              )}
              <div className="min-w-0">
                <p className="text-foreground text-sm font-medium">
                  {watchedValues.logo_url ? 'Logo' : 'Add logo'}
                </p>
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={logoUploading}
                  className="text-muted-foreground hover:text-foreground text-xs transition-colors disabled:opacity-50"
                >
                  {logoUploading
                    ? 'Uploading…'
                    : watchedValues.logo_url
                      ? 'Change image'
                      : 'PNG, JPG or WebP'}
                </button>
                {logoUploadError && (
                  <p className="text-destructive mt-0.5 text-xs">
                    {logoUploadError}
                  </p>
                )}
              </div>
            </div>

            {/* Invoice # + Status row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="number">Invoice #</Label>
                <Input
                  id="number"
                  placeholder="INV-001"
                  {...register('number')}
                />
                {errors.number && (
                  <FieldError message={errors.number.message!} />
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      modal={false}
                      items={{
                        draft: 'Draft',
                        pending: 'Pending',
                        paid: 'Paid',
                        overdue: 'Overdue',
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status…" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Auto-reminder toggle */}
            <Controller
              name="auto_reminder"
              control={control}
              render={({ field }) => (
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Label
                      htmlFor="auto_reminder"
                      className="cursor-pointer text-sm"
                    >
                      Auto-reminders
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Auto-send emails when overdue
                    </p>
                  </div>
                  <button
                    id="auto_reminder"
                    type="button"
                    role="switch"
                    aria-checked={field.value}
                    onClick={() => field.onChange(!field.value)}
                    className={cn(
                      'focus-visible:ring-ring/50 relative mt-0.5 inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:outline-none',
                      field.value ? 'bg-foreground' : 'bg-input',
                    )}
                  >
                    <span
                      className={cn(
                        'bg-background pointer-events-none inline-block h-4 w-4 rounded-full shadow-sm transition-transform',
                        field.value ? 'translate-x-4' : 'translate-x-0',
                      )}
                    />
                  </button>
                </div>
              )}
            />

            {/* Client */}
            <div className="space-y-1.5">
              <Label>Client</Label>
              <Controller
                name="client_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    modal={false}
                    items={Object.fromEntries(
                      clients.map((c) => [
                        c.id,
                        c.name + (c.company ? ` — ${c.company}` : ''),
                      ]),
                    )}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a client…" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                          {c.company ? ` — ${c.company}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.client_id && (
                <FieldError message={errors.client_id.message!} />
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Issue date</Label>
                <Controller
                  name="issue_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick date"
                    />
                  )}
                />
                {errors.issue_date && (
                  <FieldError message={errors.issue_date.message!} />
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Due date</Label>
                <Controller
                  name="due_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick date"
                    />
                  )}
                />
                {errors.due_date && (
                  <FieldError message={errors.due_date.message!} />
                )}
              </div>
            </div>

            {/* Line items */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Line items</Label>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      modal={false}
                      items={Object.fromEntries(CURRENCIES.map((c) => [c, c]))}
                    >
                      <SelectTrigger className="h-8 w-24 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Column headers */}
              <div className="text-muted-foreground grid grid-cols-[1fr_60px_90px_24px] items-center gap-2 px-1 text-xs">
                <span>Description</span>
                <span className="text-right">Qty</span>
                <span className="text-right">Unit price</span>
                <span />
              </div>

              {/* Item rows */}
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-[1fr_60px_90px_24px] items-start gap-2"
                  >
                    <div>
                      <input
                        type="text"
                        placeholder="Item description"
                        className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-lg border px-3 text-sm transition-[color,box-shadow] outline-none focus-visible:ring-3"
                        {...register(`line_items.${index}.description`)}
                      />
                      {errors.line_items?.[index]?.description && (
                        <FieldError
                          message={
                            errors.line_items[index].description!.message!
                          }
                        />
                      )}
                    </div>
                    <div>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="1"
                        className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-lg border px-2 text-right text-sm transition-[color,box-shadow] outline-none focus-visible:ring-3"
                        {...register(`line_items.${index}.quantity`, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-lg border px-2 text-right text-sm transition-[color,box-shadow] outline-none focus-visible:ring-3"
                        {...register(`line_items.${index}.unit_price`, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => fields.length > 1 && remove(index)}
                      disabled={fields.length === 1}
                      className="text-muted-foreground hover:text-destructive mt-2 transition-colors disabled:opacity-30"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {errors.line_items && !Array.isArray(errors.line_items) && (
                <FieldError
                  message={
                    (errors.line_items as { message?: string }).message ??
                    'Add at least one item'
                  }
                />
              )}

              {/* Add item + total */}
              <div className="flex items-center justify-between pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => append(newLineItem())}
                  className="text-muted-foreground hover:text-foreground -ml-2"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add item
                </Button>
                <div className="text-right">
                  <span className="text-muted-foreground text-xs">Total</span>
                  <p className="text-foreground font-semibold tabular-nums">
                    {fmt(total, watchedValues.currency)}
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="border-border h-px flex-1 border-t" />
              <span className="text-muted-foreground text-xs">Optional</span>
              <div className="border-border h-px flex-1 border-t" />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Any message or terms for the client…"
                className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full resize-none rounded-lg border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-3"
                {...register('notes')}
              />
            </div>

            {/* Payment details */}
            <div className="space-y-1.5">
              <Label htmlFor="payment_details">Payment details</Label>
              <textarea
                id="payment_details"
                rows={3}
                placeholder="Bank account, PayPal, Wise, or payment instructions…"
                className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full resize-none rounded-lg border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-3"
                {...register('payment_details')}
              />
            </div>

            {serverError && <FieldError message={serverError} />}
          </form>
        </aside>

        {/* Right panel — live preview */}
        <main
          ref={previewRef}
          className={`bg-muted/30 flex-1 items-start justify-center overflow-y-auto p-4 md:p-8 ${showPreview ? 'flex' : 'hidden md:flex'}`}
        >
          <div className="w-full max-w-xl rounded-2xl bg-white p-5 text-sm shadow-xl ring-1 ring-black/5 sm:p-8 dark:bg-zinc-900 dark:ring-white/10">
            {/* Top row */}
            <div className="mb-6 flex items-start justify-between">
              <span className="text-muted-foreground/30 text-2xl font-bold tracking-tight uppercase sm:text-3xl">
                Invoice
              </span>
              <span className="text-foreground font-mono text-sm font-semibold">
                {watchedValues.number || 'INV-001'}
              </span>
            </div>

            {/* From / Bill to */}
            <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="min-w-0">
                <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                  From
                </p>
                {(watchedValues.logo_url || userProfile?.logo_url) && (
                  <img
                    src={watchedValues.logo_url || userProfile!.logo_url!}
                    alt="Logo"
                    className="mb-2 h-10 max-w-32 object-contain"
                  />
                )}
                <p className="text-foreground font-medium">
                  {userProfile?.business_name || userName || userEmail}
                </p>
                {userProfile?.business_name && (
                  <p className="text-muted-foreground truncate text-xs">
                    {userName || userEmail}
                  </p>
                )}
                {!userProfile?.business_name && userName && (
                  <p className="text-muted-foreground truncate text-xs">
                    {userEmail}
                  </p>
                )}
                {userProfile?.business_address && (
                  <p className="text-muted-foreground mt-0.5 text-xs whitespace-pre-line">
                    {userProfile.business_address}
                  </p>
                )}
                {(userProfile?.business_phone ||
                  userProfile?.business_website) && (
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {[userProfile.business_phone, userProfile.business_website]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                )}
                {userProfile?.tax_id && (
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Tax ID: {userProfile.tax_id}
                  </p>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                  Bill to
                </p>
                {selectedClient ? (
                  <>
                    <p className="text-foreground font-medium">
                      {selectedClient.name}
                    </p>
                    {selectedClient.company && (
                      <p className="text-muted-foreground text-xs">
                        {selectedClient.company}
                      </p>
                    )}
                    <p className="text-muted-foreground truncate text-xs">
                      {selectedClient.email}
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground italic">
                    Select a client…
                  </p>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="mb-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                  Issue date
                </p>
                <p className="text-foreground">
                  {fmtDate(watchedValues.issue_date)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                  Due date
                </p>
                <p className="text-foreground">
                  {fmtDate(watchedValues.due_date)}
                </p>
              </div>
            </div>

            <hr className="border-border mb-4" />

            {/* Line items table */}
            <div className="mb-4">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-border border-b">
                    <th className="text-muted-foreground pb-2 text-left text-xs font-medium tracking-wide uppercase">
                      Description
                    </th>
                    <th className="text-muted-foreground w-10 pb-2 text-right text-xs font-medium tracking-wide uppercase">
                      Qty
                    </th>
                    <th className="text-muted-foreground w-24 pb-2 text-right text-xs font-medium tracking-wide uppercase">
                      Unit price
                    </th>
                    <th className="text-muted-foreground w-20 pb-2 text-right text-xs font-medium tracking-wide uppercase">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-muted-foreground py-4 text-center italic"
                      >
                        No items yet
                      </td>
                    </tr>
                  ) : (
                    lineItems.map((item, i) => {
                      const rowTotal =
                        (Number(item.quantity) || 0) *
                        (Number(item.unit_price) || 0)
                      return (
                        <tr key={i} className="border-border border-b">
                          <td className="text-foreground py-2">
                            {item.description || (
                              <span className="text-muted-foreground italic">
                                —
                              </span>
                            )}
                          </td>
                          <td className="text-muted-foreground py-2 text-right tabular-nums">
                            {Number(item.quantity) || 0}
                          </td>
                          <td className="text-muted-foreground py-2 text-right tabular-nums">
                            {fmt(
                              Number(item.unit_price) || 0,
                              watchedValues.currency,
                            )}
                          </td>
                          <td className="text-foreground py-2 text-right tabular-nums">
                            {fmt(rowTotal, watchedValues.currency)}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
              <div className="flex justify-between py-3">
                <span className="text-foreground font-semibold">Total due</span>
                <span className="text-foreground font-semibold tabular-nums">
                  {fmt(total, watchedValues.currency)}
                </span>
              </div>
            </div>

            <hr className="border-border mb-4" />

            {/* Notes */}
            {watchedValues.notes && watchedValues.notes.trim() && (
              <div className="mb-4">
                <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                  Notes
                </p>
                <p className="text-foreground text-sm whitespace-pre-wrap">
                  {watchedValues.notes}
                </p>
              </div>
            )}

            {/* Payment details */}
            {watchedValues.payment_details &&
              watchedValues.payment_details.trim() && (
                <div className="mb-4">
                  <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                    Payment details
                  </p>
                  <p className="text-foreground text-sm whitespace-pre-wrap">
                    {watchedValues.payment_details}
                  </p>
                </div>
              )}

            {/* Escalation hint */}
            {(watchedValues.status === 'pending' ||
              watchedValues.status === 'overdue') && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-muted-foreground text-xs">
                  Follow-up tone:
                </span>
                <ToneBadge invoice={previewInvoice} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
