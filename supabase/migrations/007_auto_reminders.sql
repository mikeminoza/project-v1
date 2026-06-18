ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS auto_reminder BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.reminders
  ADD COLUMN IF NOT EXISTS tone_level TEXT;
