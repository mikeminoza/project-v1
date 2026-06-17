'use client'

import { useRef, useState, useTransition } from 'react'
import { Info, RotateCcw, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { saveTemplatesAction } from '@/actions/save-templates'
import { DEFAULT_TEMPLATES } from '@/lib/email'
import type { EmailTemplateLevel, EmailTemplates } from '@/types'

const LEVELS: {
  level: EmailTemplateLevel
  label: string
  description: string
}[] = [
  { level: 'nudge', label: 'Gentle nudge', description: '1–3 days overdue' },
  { level: 'follow-up', label: 'Follow up', description: '4–7 days overdue' },
  { level: 'firm', label: 'Firm', description: '8–14 days overdue' },
  { level: 'strong', label: 'Strong', description: '15–30 days overdue' },
  { level: 'final', label: 'Final notice', description: '30+ days overdue' },
]

const VARIABLES: { key: string; label: string }[] = [
  { key: '{{first_name}}', label: "Client's first name" },
  { key: '{{client_name}}', label: "Client's full name" },
  { key: '{{invoice_number}}', label: 'Invoice number' },
  { key: '{{amount}}', label: 'Amount due' },
  { key: '{{due_date}}', label: 'Due date' },
]

interface Props {
  initialTemplates: EmailTemplates
}

export function EmailTemplatesForm({ initialTemplates }: Props) {
  const [activeLevel, setActiveLevel] = useState<EmailTemplateLevel>('nudge')
  const [templates, setTemplates] = useState<EmailTemplates>(initialTemplates)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subjectRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const cursorRef = useRef<{
    field: 'subject' | 'message'
    start: number
    end: number
  }>({ field: 'message', start: 0, end: 0 })

  const custom = templates[activeLevel]
  const defaults = DEFAULT_TEMPLATES[activeLevel]
  const subject = custom?.subject ?? defaults.subject
  const message = custom?.message ?? defaults.message
  const isCustomized = !!custom

  function saveCursor(field: 'subject' | 'message') {
    const el = field === 'subject' ? subjectRef.current : messageRef.current
    if (el) {
      cursorRef.current = {
        field,
        start: el.selectionStart ?? el.value.length,
        end: el.selectionEnd ?? el.value.length,
      }
    }
  }

  function setField(field: 'subject' | 'message', value: string) {
    setTemplates((prev) => ({
      ...prev,
      [activeLevel]: {
        subject:
          field === 'subject'
            ? value
            : (prev[activeLevel]?.subject ?? defaults.subject),
        message:
          field === 'message'
            ? value
            : (prev[activeLevel]?.message ?? defaults.message),
      },
    }))
  }

  function insertVariable(varKey: string) {
    const { field, start, end } = cursorRef.current
    const el = field === 'subject' ? subjectRef.current : messageRef.current
    if (!el) return
    const val = el.value
    const next = val.slice(0, start) + varKey + val.slice(end)
    const newPos = start + varKey.length
    setField(field, next)
    cursorRef.current = { field, start: newPos, end: newPos }
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(newPos, newPos)
    })
  }

  function reset() {
    setTemplates((prev) => {
      const next = { ...prev }
      delete next[activeLevel]
      return next
    })
  }

  function save() {
    setSaved(false)
    setError(null)
    startTransition(async () => {
      const result = await saveTemplatesAction(templates)
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(result.error ?? 'Failed to save')
      }
    })
  }

  return (
    <div className="space-y-5">
      {/* How-to instructions */}
      <div className="border-border bg-muted/40 flex gap-3 rounded-lg border p-4 text-sm">
        <Info className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
        <div className="text-muted-foreground space-y-1.5">
          <p>
            <strong className="text-foreground">Pick a level</strong> — each tab
            represents how far past due the invoice is. The matching template is
            used automatically when a reminder is sent.
          </p>
          <p>
            <strong className="text-foreground">Use variables</strong> —
            placeholders like{' '}
            <code className="bg-muted rounded px-1 font-mono text-xs">
              {'{{first_name}}'}
            </code>{' '}
            are replaced with real data at send time. Click a chip below to
            insert one at your cursor position.
          </p>
          <p>
            A <span className="text-foreground font-medium">•</span> dot on a
            tab means that level has been customized. Use{' '}
            <span className="text-foreground font-medium">
              Reset to default
            </span>{' '}
            to restore the original wording. Click{' '}
            <span className="text-foreground font-medium">Save templates</span>{' '}
            to apply all changes at once.
          </p>
        </div>
      </div>

      {/* Level tabs */}
      <div className="flex flex-wrap gap-2">
        {LEVELS.map(({ level, label, description }) => (
          <button
            key={level}
            type="button"
            onClick={() => setActiveLevel(level)}
            className={cn(
              'rounded-lg border px-3 py-2 text-left text-sm transition-colors',
              activeLevel === level
                ? 'border-foreground/20 bg-foreground/5 text-foreground'
                : 'border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground',
            )}
          >
            <span className="font-medium">
              {label}
              {templates[level] && (
                <span className="ml-1.5 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-current opacity-50" />
              )}
            </span>
            <br />
            <span className="text-xs opacity-60">{description}</span>
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="border-border space-y-4 rounded-lg border p-4">
        {/* Subject */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="tpl-subject">Subject</Label>
            {isCustomized && (
              <button
                type="button"
                onClick={reset}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset to default
              </button>
            )}
          </div>
          <Input
            id="tpl-subject"
            ref={subjectRef}
            value={subject}
            onChange={(e) => setField('subject', e.target.value)}
            onBlur={() => saveCursor('subject')}
            onSelect={() => saveCursor('subject')}
          />
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <Label htmlFor="tpl-message">Message</Label>
          <textarea
            id="tpl-message"
            ref={messageRef}
            rows={6}
            value={message}
            onChange={(e) => setField('message', e.target.value)}
            onBlur={() => saveCursor('message')}
            onSelect={() => saveCursor('message')}
            className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex w-full resize-none rounded-lg border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-3"
          />
        </div>

        {/* Variable chips */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs">
            Insert variable at cursor
          </p>
          <div className="grid gap-1">
            {VARIABLES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => insertVariable(key)}
                className="hover:bg-muted flex items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors"
              >
                <code className="border-border bg-muted text-foreground rounded border px-1.5 py-0.5 font-mono text-xs">
                  {key}
                </code>
                <span className="text-muted-foreground text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="button" onClick={save} disabled={isPending}>
          {isPending ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Save templates
        </Button>
        {saved && (
          <span className="text-muted-foreground text-sm">
            All templates saved
          </span>
        )}
      </div>
    </div>
  )
}
