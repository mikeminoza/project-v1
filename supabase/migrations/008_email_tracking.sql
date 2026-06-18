ALTER TABLE public.reminders
  ADD COLUMN IF NOT EXISTS resend_email_id TEXT,
  ADD COLUMN IF NOT EXISTS opened_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS clicked_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS reminders_resend_email_id_idx
  ON public.reminders (resend_email_id)
  WHERE resend_email_id IS NOT NULL;
