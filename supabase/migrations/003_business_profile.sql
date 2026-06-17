-- Add business profile fields to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS business_name             text,
  ADD COLUMN IF NOT EXISTS business_address          text,
  ADD COLUMN IF NOT EXISTS business_phone            text,
  ADD COLUMN IF NOT EXISTS business_website          text,
  ADD COLUMN IF NOT EXISTS tax_id                    text,
  ADD COLUMN IF NOT EXISTS logo_url                  text,
  ADD COLUMN IF NOT EXISTS default_payment_details   text;

-- Add payment_details to invoices table
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS payment_details text;

-- Storage bucket for logos (public read, owner write)
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Logos are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'logos');

CREATE POLICY "Users can upload own logo"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'logos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own logo"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'logos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own logo"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'logos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
