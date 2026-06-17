-- Per-invoice logo/image (overrides the profile logo for that invoice)
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS logo_url text;
