import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { invoicesDb } from '@/lib/db'
import { fmtCurrency, fmtDate } from '@/lib/email'
import { MarkPaidButton } from './mark-paid-button'

export default async function PayPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = createAdminClient()
  const invoice = await invoicesDb.getByPortalToken(supabase, token)
  if (!invoice) notFound()

  const { profile, client } = invoice
  const businessName = profile?.business_name || 'Your service provider'
  const logoUrl = invoice.logo_url || profile?.logo_url
  const paymentDetails =
    invoice.payment_details || profile?.default_payment_details
  const isPaid = invoice.status === 'paid'
  const isDraft = invoice.status === 'draft'
  const isActionable =
    invoice.status === 'pending' || invoice.status === 'overdue'

  const statusConfig: Record<string, { label: string; color: string }> = {
    paid: { label: 'Paid', color: '#10b981' },
    overdue: { label: 'Overdue', color: '#ef4444' },
    pending: { label: 'Due', color: '#f59e0b' },
    draft: { label: 'Draft', color: '#9ca3af' },
  }
  const status = statusConfig[invoice.status] ?? statusConfig.pending

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-xl">
        {/* Business header */}
        <div className="mb-6 flex items-center gap-3">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={businessName}
              className="h-10 w-10 rounded-lg object-contain"
            />
          )}
          <div>
            <p className="font-semibold text-gray-900">{businessName}</p>
            {profile?.business_address && (
              <p className="text-xs text-gray-500">
                {profile.business_address}
              </p>
            )}
          </div>
        </div>

        {/* Main card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          {/* Colour accent + status */}
          <div
            className="flex h-1.5 w-full"
            style={{ background: status.color }}
          />

          <div className="p-6 sm:p-8">
            {/* Invoice number + status */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                  Invoice
                </p>
                <p className="font-mono text-2xl font-bold text-gray-900">
                  {invoice.number}
                </p>
              </div>
              <span
                className="mt-1 rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: `${status.color}18`,
                  color: status.color,
                }}
              >
                {status.label}
              </span>
            </div>

            {/* From / To */}
            <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="mb-1 text-xs font-semibold tracking-widest text-gray-400 uppercase">
                  From
                </p>
                <p className="font-medium text-gray-900">{businessName}</p>
                {profile?.business_phone && (
                  <p className="text-gray-500">{profile.business_phone}</p>
                )}
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold tracking-widest text-gray-400 uppercase">
                  Bill to
                </p>
                <p className="font-medium text-gray-900">{client.name}</p>
                <p className="text-gray-500">{client.email}</p>
                {client.company && (
                  <p className="text-gray-500">{client.company}</p>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 px-4 py-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Issue date</p>
                <p className="font-medium text-gray-800">
                  {fmtDate(invoice.issue_date)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Due date</p>
                <p className="font-medium text-gray-800">
                  {fmtDate(invoice.due_date)}
                </p>
              </div>
            </div>

            {/* Line items */}
            {invoice.line_items && invoice.line_items.length > 0 && (
              <div className="mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-2 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
                        Description
                      </th>
                      <th className="pb-2 text-right text-xs font-semibold tracking-wider text-gray-400 uppercase">
                        Qty
                      </th>
                      <th className="pb-2 text-right text-xs font-semibold tracking-wider text-gray-400 uppercase">
                        Price
                      </th>
                      <th className="pb-2 text-right text-xs font-semibold tracking-wider text-gray-400 uppercase">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.line_items.map((item, i) => (
                      <tr
                        key={item.id ?? i}
                        className="border-b border-gray-50"
                      >
                        <td className="py-2.5 text-gray-700">
                          {item.description || '—'}
                        </td>
                        <td className="py-2.5 text-right text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 text-right text-gray-500">
                          {fmtCurrency(item.unit_price, invoice.currency)}
                        </td>
                        <td className="py-2.5 text-right font-medium text-gray-700">
                          {fmtCurrency(
                            item.quantity * item.unit_price,
                            invoice.currency,
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Total */}
            <div
              className="mb-6 flex items-center justify-between rounded-lg px-4 py-3 text-lg font-bold"
              style={{ background: `${status.color}10`, color: status.color }}
            >
              <span>Total due</span>
              <span>{fmtCurrency(invoice.amount, invoice.currency)}</span>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-6 rounded-lg border-l-4 border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <p className="mb-0.5 text-xs font-semibold tracking-wider text-amber-500 uppercase">
                  Notes
                </p>
                <p className="whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}

            {/* Payment instructions */}
            {paymentDetails && (
              <div className="mb-6 rounded-lg bg-gray-50 px-4 py-4">
                <p className="mb-1.5 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Payment instructions
                </p>
                <p className="text-sm whitespace-pre-wrap text-gray-700">
                  {paymentDetails}
                </p>
              </div>
            )}

            {/* CTA */}
            {isDraft ? (
              <p className="text-center text-sm text-gray-400">
                This invoice has not yet been finalized.
              </p>
            ) : isPaid ? (
              <div className="flex flex-col items-center gap-2 rounded-xl bg-emerald-50 px-6 py-5 text-center">
                <p className="text-2xl">✓</p>
                <p className="font-semibold text-emerald-800">
                  Payment received
                </p>
                <p className="text-sm text-emerald-700">
                  Thank you — this invoice has been settled.
                </p>
              </div>
            ) : isActionable ? (
              <MarkPaidButton
                portalToken={invoice.portal_token}
                businessName={businessName}
              />
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Powered by <span className="font-semibold text-gray-500">Invoq</span>
        </p>
      </div>
    </div>
  )
}
