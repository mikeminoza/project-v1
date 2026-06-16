import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
    </>
  )
}
