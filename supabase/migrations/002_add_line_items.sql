-- Add line_items column to invoices table
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS line_items JSONB NOT NULL DEFAULT '[]';
