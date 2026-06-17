'use client'

import { useRef, useState, useTransition } from 'react'
import { Loader2, Upload, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { updateProfileAction } from '@/actions/update-profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { UserProfile } from '@/types'

interface BusinessProfileFormProps {
  profile: UserProfile
  userId: string
}

export function BusinessProfileForm({
  profile,
  userId,
}: BusinessProfileFormProps) {
  const supabase = createClient()
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(
    profile.logo_url,
  )
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [logoRemoved, setLogoRemoved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingFile(file)
    setLogoPreview(URL.createObjectURL(file))
    setLogoRemoved(false)
  }

  function removeLogo() {
    setLogoPreview(null)
    setPendingFile(null)
    setLogoRemoved(true)
    if (fileRef.current) fileRef.current.value = ''
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaved(false)
    setError(null)

    const fileToUpload = pendingFile
    const shouldRemove = logoRemoved

    // Clear file input before FormData so the binary doesn't travel through
    // the Next.js server action (which has a 1 MB body limit by default).
    if (fileRef.current) fileRef.current.value = ''
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        if (fileToUpload) {
          const ext = fileToUpload.name.split('.').pop()?.toLowerCase() || 'png'
          const path = `${userId}/logo.${ext}`
          const { error: uploadErr } = await supabase.storage
            .from('logos')
            .upload(path, fileToUpload, {
              upsert: true,
              contentType: fileToUpload.type,
            })
          if (uploadErr) throw new Error(uploadErr.message)
          const {
            data: { publicUrl },
          } = supabase.storage.from('logos').getPublicUrl(path)
          formData.set('logo_url', publicUrl)
        } else if (shouldRemove) {
          formData.set('remove_logo', 'true')
        }

        const result = await updateProfileAction(formData)
        if (result.success) {
          setSaved(true)
          setPendingFile(null)
          setLogoRemoved(false)
        } else {
          setError(result.error ?? 'Failed to save')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Logo upload */}
      <div className="space-y-2">
        <Label>Business logo</Label>
        <div className="flex items-start gap-4">
          {logoPreview ? (
            <div className="relative">
              <img
                src={logoPreview}
                alt="Logo preview"
                className="border-border h-16 max-w-40 rounded-lg border object-contain p-1"
              />
              <button
                type="button"
                onClick={removeLogo}
                className="border-border bg-background text-muted-foreground hover:text-foreground absolute -top-2 -right-2 rounded-full border p-0.5"
                aria-label="Remove logo"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="border-border text-muted-foreground hover:border-brand hover:text-foreground flex h-16 w-32 items-center justify-center rounded-lg border-2 border-dashed transition-colors"
            >
              <Upload className="h-5 w-5" />
            </button>
          )}
          <div className="flex flex-col gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileRef.current?.click()}
            >
              {logoPreview ? 'Change logo' : 'Upload logo'}
            </Button>
            <p className="text-muted-foreground text-xs">
              PNG, JPG or WebP up to 5 MB
            </p>
          </div>
        </div>
        {/* Hidden file input — file is uploaded client-side directly to Supabase Storage */}
        <input
          ref={fileRef}
          type="file"
          name="logo_file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Personal name */}
      <div className="space-y-1.5">
        <Label htmlFor="full_name">Your name</Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={profile.full_name ?? ''}
          placeholder="Jane Smith"
        />
      </div>

      {/* Business name */}
      <div className="space-y-1.5">
        <Label htmlFor="business_name">
          Business name{' '}
          <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Input
          id="business_name"
          name="business_name"
          defaultValue={profile.business_name ?? ''}
          placeholder="Acme Freelance Studio"
        />
      </div>

      {/* Business address */}
      <div className="space-y-1.5">
        <Label htmlFor="business_address">Business address</Label>
        <textarea
          id="business_address"
          name="business_address"
          rows={2}
          defaultValue={profile.business_address ?? ''}
          placeholder="123 Main St, City, Country"
          className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full resize-none rounded-lg border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-3"
        />
      </div>

      {/* Phone + website */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="business_phone">Phone</Label>
          <Input
            id="business_phone"
            name="business_phone"
            defaultValue={profile.business_phone ?? ''}
            placeholder="+1 234 567 890"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="business_website">Website</Label>
          <Input
            id="business_website"
            name="business_website"
            defaultValue={profile.business_website ?? ''}
            placeholder="yoursite.com"
          />
        </div>
      </div>

      {/* Tax ID */}
      <div className="space-y-1.5">
        <Label htmlFor="tax_id">
          Tax ID / VAT number{' '}
          <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Input
          id="tax_id"
          name="tax_id"
          defaultValue={profile.tax_id ?? ''}
          placeholder="GB123456789"
        />
      </div>

      {/* Default payment details */}
      <div className="space-y-1.5">
        <Label htmlFor="default_payment_details">Default payment details</Label>
        <textarea
          id="default_payment_details"
          name="default_payment_details"
          rows={4}
          defaultValue={profile.default_payment_details ?? ''}
          placeholder={`Bank: XYZ Bank\nAccount number: 12345678\nSort code: 00-00-00\nPayPal: you@example.com`}
          className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full resize-none rounded-lg border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-3"
        />
        <p className="text-muted-foreground text-xs">
          Pre-fills the payment details field on new invoices
        </p>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Save profile
        </Button>
        {saved && (
          <span className="text-muted-foreground text-sm">
            Saved successfully!
          </span>
        )}
      </div>
    </form>
  )
}
