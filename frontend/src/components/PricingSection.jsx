function PricingSection() {
  return (
    <section className="py-10 mt-8 relative overflow-hidden">
      {/* Orange accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
      
      {/* Subtle orange glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-orange-500/5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Left - Pricing Plans */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Check our Pricing plans
            </h3>
            <div className="space-y-3">
              <div className="border-l-4 border-orange-500 pl-4">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm text-gray-400">1 Year</span>
                  <span className="text-2xl font-bold text-orange-500">4.99€</span>
                </div>
                <p className="text-xs text-gray-500">Full access for 12 months</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm text-gray-400">Lifetime</span>
                  <span className="text-2xl font-bold text-orange-500">13.99€</span>
                </div>
                <p className="text-xs text-gray-500">One-time payment, forever access</p>
              </div>
            </div>
          </div>

          {/* Center - Reseller */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Do you want to become a Reseller?
            </h3>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              Discover our packs with exceptional discounts!
            </p>
            <button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-orange-500/20">
              Contact us
            </button>
          </div>

          {/* Right - Upload List */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Upload your list
            </h3>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              App support all kinds of M3U content and XtreamCode Servers
            </p>
            <button className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingSection
