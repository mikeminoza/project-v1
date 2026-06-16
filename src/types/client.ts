export interface Client {
  id: string
  user_id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  address: string | null
  created_at: string
  updated_at: string
}
