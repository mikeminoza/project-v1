export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  business_name: string | null
  business_address: string | null
  business_phone: string | null
  business_website: string | null
  tax_id: string | null
  logo_url: string | null
  default_payment_details: string | null
  created_at: string
  updated_at: string
}
