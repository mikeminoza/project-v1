export type ReminderTrigger = 'before_due' | 'on_due' | 'after_due'

export interface Reminder {
  id: string
  invoice_id: string
  trigger: ReminderTrigger
  days_offset: number
  sent_at: string | null
  tone_level: string | null
  created_at: string
}

export interface ReminderSettings {
  before_due_enabled: boolean
  before_due_days: number
  on_due_enabled: boolean
  after_due_enabled: boolean
  after_due_days: number[]
}
