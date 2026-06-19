import Link from 'next/link'

function InvozeIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="7" fill="#34d399" />
      <path d="M20 4L13 17h5L12 28l10-13h-5z" fill="#052e16" />
    </svg>
  )
}

export function Logo({ size }: { size?: number }) {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
      <InvozeIcon size={size} />
      <span>
        Invo<span className="text-brand">ze</span>
      </span>
    </Link>
  )
}
