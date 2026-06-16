import { CTABanner } from '@/components/cta-banner'
import { FAQ } from '@/components/faq'
import { Features } from '@/components/features'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { Navbar } from '@/components/navbar'
import { Pricing } from '@/components/pricing'
import { Testimonials } from '@/components/testimonials'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </>
  )
}
