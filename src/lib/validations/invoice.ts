import { z } from 'zod'

const lineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(0.01, 'Must be greater than 0'),
  unit_price: z.number().min(0, 'Must be 0 or greater'),
})

export const invoiceSchema = z
  .object({
    client_id: z.string().min(1, 'Select a client'),
    number: z.string().min(1, 'Invoice number is required'),
    currency: z.string().min(1),
    line_items: z.array(lineItemSchema).min(1, 'Add at least one line item'),
    issue_date: z.string().min(1, 'Issue date is required'),
    due_date: z.string().min(1, 'Due date is required'),
    status: z.enum(['draft', 'pending', 'paid', 'overdue']),
    notes: z.string().optional(),
    payment_details: z.string().optional(),
    logo_url: z.string().optional(),
    auto_reminder: z.boolean(),
  })
  .refine((d) => new Date(d.due_date) >= new Date(d.issue_date), {
    message: 'Due date must be on or after the issue date',
    path: ['due_date'],
  })

export type InvoiceValues = z.infer<typeof invoiceSchema>
