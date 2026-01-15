import HeroSection from '../components/HeroSection'
import AvailablePlatforms from '../components/AvailablePlatforms'
import DisclaimerSection from '../components/DisclaimerSection'
import FeaturesSection from '../components/FeaturesSection'
import CTASection from '../components/CTASection'
import PricingSection from '../components/PricingSection'
import FAQSection from '../components/FAQSection'

function Home() {
  return (
    <>
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <HeroSection />
          </div>

          {/* Right Column - Available Platforms */}
          <div className="lg:col-span-1">
            <AvailablePlatforms />
          </div>
        </div>
      </main>
      <DisclaimerSection />
      <FeaturesSection />
      <CTASection />
      <PricingSection />
      <FAQSection />
    </>
  )
}

export default Home
