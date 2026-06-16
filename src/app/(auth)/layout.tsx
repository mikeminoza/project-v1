export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-6 py-16">
      {children}
    </div>
  )
}
