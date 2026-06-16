import { z } from 'zod'

export const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
})

export type ClientValues = z.infer<typeof clientSchema>
