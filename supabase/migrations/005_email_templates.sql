ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email_templates JSONB NOT NULL DEFAULT '{}';
