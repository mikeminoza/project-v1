ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS portal_token UUID NOT NULL DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS invoices_portal_token_idx
  ON public.invoices (portal_token);
