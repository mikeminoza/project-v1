import React from 'react'
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from '@react-pdf/renderer'
import type { InvoiceWithClient } from '@/types'
import type { UserProfile } from '@/types'

const C = {
  dark: '#111827',
  mid: '#374151',
  muted: '#6B7280',
  label: '#9CA3AF',
  border: '#E5E7EB',
  bg: '#FFFFFF',
  titleGray: '#D1D5DB',
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: C.dark,
    backgroundColor: C.bg,
    paddingTop: 40,
    paddingBottom: 48,
    paddingLeft: 48,
    paddingRight: 48,
  },
  row: { flexDirection: 'row' },
  col2: { flex: 1 },
  mb4: { marginBottom: 4 },
  mb6: { marginBottom: 6 },
  mb8: { marginBottom: 8 },
  mb16: { marginBottom: 16 },
  mb24: { marginBottom: 24 },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginBottom: 12,
    marginTop: 4,
  },
  invoiceTitle: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: C.titleGray,
    letterSpacing: -0.5,
    textTransform: 'uppercase',
  },
  invoiceNumber: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 13,
    color: C.dark,
    textAlign: 'right',
  },
  sectionLabel: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: C.label,
    marginBottom: 5,
  },
  fromName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: C.dark,
    marginBottom: 2,
  },
  fromSub: { fontSize: 9, color: C.muted, marginBottom: 1 },
  clientName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: C.dark,
    marginBottom: 2,
  },
  clientSub: { fontSize: 9, color: C.muted, marginBottom: 1 },
  dateLabel: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: C.label,
    marginBottom: 4,
  },
  dateValue: { fontSize: 10, color: C.mid },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingBottom: 6,
    marginBottom: 4,
  },
  thLeft: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: C.label,
    flex: 1,
  },
  thRight: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: C.label,
    width: 60,
    textAlign: 'right',
  },
  thWide: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: C.label,
    width: 72,
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingTop: 8,
    paddingBottom: 8,
  },
  tdDesc: { fontSize: 10, color: C.mid, flex: 1, paddingRight: 8 },
  tdRight: { fontSize: 10, color: C.mid, width: 60, textAlign: 'right' },
  tdAmount: { fontSize: 10, color: C.dark, width: 72, textAlign: 'right' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 12,
  },
  totalLabel: { fontFamily: 'Helvetica-Bold', fontSize: 12, color: C.dark },
  totalValue: { fontFamily: 'Helvetica-Bold', fontSize: 12, color: C.dark },
  sectionTitle: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: C.label,
    marginBottom: 5,
    marginTop: 14,
  },
  sectionBody: { fontSize: 9, color: C.mid, lineHeight: 1.5 },
})

function fmt(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

function fmtDate(dateStr: string) {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

interface Props {
  invoice: InvoiceWithClient
  profile: UserProfile | null
}

export function InvoiceDocument({ invoice, profile }: Props) {
  const fromName =
    profile?.business_name || profile?.full_name || profile?.email || ''
  const fromSubName = profile?.business_name
    ? profile?.full_name || profile?.email
    : ''
  const logoUrl = invoice.logo_url || profile?.logo_url || null

  const lineItems = Array.isArray(invoice.line_items) ? invoice.line_items : []

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title row */}
        <View
          style={[styles.row, { alignItems: 'flex-start', marginBottom: 28 }]}
        >
          <Text style={styles.invoiceTitle}>Invoice</Text>
          <Text style={styles.invoiceNumber}>{invoice.number}</Text>
        </View>

        {/* From / Bill To */}
        <View style={[styles.row, styles.mb24]}>
          <View style={styles.col2}>
            <Text style={styles.sectionLabel}>From</Text>
            {logoUrl && (
              <Image
                src={logoUrl}
                style={{
                  height: 32,
                  maxWidth: 100,
                  objectFit: 'contain',
                  marginBottom: 6,
                }}
              />
            )}
            {fromName ? <Text style={styles.fromName}>{fromName}</Text> : null}
            {fromSubName ? (
              <Text style={styles.fromSub}>{fromSubName}</Text>
            ) : null}
            {profile?.business_address ? (
              <Text style={[styles.fromSub, { marginTop: 2 }]}>
                {profile.business_address}
              </Text>
            ) : null}
            {profile?.business_phone || profile?.business_website ? (
              <Text style={[styles.fromSub, { marginTop: 2 }]}>
                {[profile?.business_phone, profile?.business_website]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            ) : null}
            {profile?.tax_id ? (
              <Text style={[styles.fromSub, { marginTop: 2 }]}>
                Tax ID: {profile.tax_id}
              </Text>
            ) : null}
          </View>
          <View style={styles.col2}>
            <Text style={styles.sectionLabel}>Bill to</Text>
            <Text style={styles.clientName}>{invoice.client.name}</Text>
            {invoice.client.company ? (
              <Text style={styles.clientSub}>{invoice.client.company}</Text>
            ) : null}
            <Text style={styles.clientSub}>{invoice.client.email}</Text>
          </View>
        </View>

        {/* Dates */}
        <View style={[styles.row, styles.mb16]}>
          <View style={styles.col2}>
            <Text style={styles.dateLabel}>Issue date</Text>
            <Text style={styles.dateValue}>{fmtDate(invoice.issue_date)}</Text>
          </View>
          <View style={styles.col2}>
            <Text style={styles.dateLabel}>Due date</Text>
            <Text style={styles.dateValue}>{fmtDate(invoice.due_date)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Table header */}
        <View style={styles.tableHeader}>
          <Text style={styles.thLeft}>Description</Text>
          <Text style={styles.thRight}>Qty</Text>
          <Text style={styles.thWide}>Unit price</Text>
          <Text style={styles.thWide}>Amount</Text>
        </View>

        {/* Line items */}
        {lineItems.map((item, i) => (
          <View key={item.id ?? i} style={styles.tableRow}>
            <Text style={styles.tdDesc}>{item.description || '—'}</Text>
            <Text style={styles.tdRight}>{Number(item.quantity)}</Text>
            <Text style={styles.tdRight}>
              {fmt(Number(item.unit_price), invoice.currency)}
            </Text>
            <Text style={styles.tdAmount}>
              {fmt(
                Number(item.quantity) * Number(item.unit_price),
                invoice.currency,
              )}
            </Text>
          </View>
        ))}

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total due</Text>
          <Text style={styles.totalValue}>
            {fmt(invoice.amount, invoice.currency)}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Notes */}
        {invoice.notes?.trim() ? (
          <View>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.sectionBody}>{invoice.notes.trim()}</Text>
          </View>
        ) : null}

        {/* Payment details */}
        {invoice.payment_details?.trim() ? (
          <View>
            <Text style={styles.sectionTitle}>Payment details</Text>
            <Text style={styles.sectionBody}>
              {invoice.payment_details.trim()}
            </Text>
          </View>
        ) : null}
      </Page>
    </Document>
  )
}
