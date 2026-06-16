import { CTABanner } from '@/components/landing/cta-banner'
import { FAQ } from '@/components/landing/faq'
import { Features } from '@/components/landing/features'
import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Pricing } from '@/components/landing/pricing'
import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </>
  )
}
