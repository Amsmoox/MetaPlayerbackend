function FeaturesSection() {
  const features = [
    {
      title: "Entertainment & Media",
      items: [
        "Live TV Streaming: Access to real-time broadcast channels with high-performance 4K streaming support.",
        "VOD (Movies): A dedicated cinema section for Video-on-Demand content, categorized automatically from your playlist.",
        "Series & TV Shows: Organized browsing of multi-episode series with smart detection for seasons and episodes.",
        "Electronic Program Guide (EPG): Integrated support for XMLTV/EPG data to see current and upcoming program schedules for live channels."
      ],
      image: "https://cdn.aptoide.com/imgs/2/d/8/2d8f8000c53f5be4b5da4af7e5ab7018_fgraphic.png",
      align: "left"
    },
    {
      title: "Personalization & History",
      items: [
        "Favorites System: Ability to mark specific channels or movies as favorites for instant access from a dedicated category.",
        "Quick Resume (History): Tracks recently watched content and displays it on the home screen so you can jump back in exactly where you left off.",
        "Smart Category Detection: An advanced engine that automatically sorts your playlist into Live TV, Movies, and Series by analyzing URLs and metadata."
      ],
      image: "https://cdn.aptoide.com/imgs/2/d/8/2d8f8000c53f5be4b5da4af7e5ab7018_fgraphic.png",
      align: "right"
    },
    {
      title: "Device & Activation System",
      items: [
        "Deterministic MAC Identity: Uses a unique, static MAC address that stays the same even if you uninstall and reinstall the app.",
        "7-Day Free Trial: Automatic assignment of a free trial period for all new devices.",
        "Multi-Tier Licensing: Support for Yearly and Lifetime activation states, managed through a central backend.",
        "Real-time Status Tracking: A heartbeat system that updates your activation status every 5 minutes to ensure no service interruption."
      ],
      image: "https://cdn.aptoide.com/imgs/2/d/8/2d8f8000c53f5be4b5da4af7e5ab7018_fgraphic.png",
      align: "left"
    },
    {
      title: "User Experience (UX)",
      items: [
        "Pro Layout Home Screen: A premium, cinema-style dashboard featuring a large \"Hero\" card for Live TV and sleek vertical stacks for VOD content.",
        "Setup Wizard: A clean, step-by-step onboarding screen for new users that displays the device MAC and instructions for playlist upload.",
        "System Settings: A dedicated area to view technical device info, subscription expiration dates, and activation portal links.",
        "Safety Exit Flow: A custom confirmation modal with a unique design to prevent accidental app closures.",
        "Android TV Optimized: Fully compatible with TV launchers, including a custom high-definition banner and logo for the leanback interface."
      ],
      image: "https://cdn.aptoide.com/imgs/2/d/8/2d8f8000c53f5be4b5da4af7e5ab7018_fgraphic.png",
      align: "right"
    }
  ]

  return (
    <section className="py-6 mt-8">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">Features</h2>
        
        {/* Compact 2-column grid for features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-lg p-4 border border-gray-800 flex gap-4"
            >
              {/* Small Image Thumbnail */}
              <div className="flex-shrink-0 w-24 h-24">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover rounded border border-gray-800"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-orange-500 mb-2">
                  {feature.title}
                </h3>
                <div className="space-y-1.5">
                  {feature.items.slice(0, 2).map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start">
                      <svg className="w-3 h-3 text-orange-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                      <p className="text-xs text-gray-300 leading-snug">
                        {item.split(':')[0]}: <span className="text-gray-400">{item.split(':').slice(1).join(':')}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* YouTube Video with Content - Compact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Content */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-orange-500 mb-3">
              Watch MetaPlayer in Action
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Experience the power of MetaPlayer through our comprehensive demo video. See how easy it is to navigate through Live TV channels, browse your favorite movies and series, and enjoy a seamless entertainment experience.
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">
              Discover the intuitive interface, smart category detection, and all the features that make MetaPlayer the ultimate media player for your entertainment needs.
            </p>
            <div className="space-y-2 mt-4">
              <div className="flex items-start">
                <svg className="w-3 h-3 text-orange-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
                <p className="text-xs text-gray-300 leading-relaxed">
                  <span className="font-semibold text-orange-400">Live TV Navigation:</span> Watch how smoothly you can browse through hundreds of channels with our optimized interface.
                </p>
              </div>
              <div className="flex items-start">
                <svg className="w-3 h-3 text-orange-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
                <p className="text-xs text-gray-300 leading-relaxed">
                  <span className="font-semibold text-orange-400">VOD Experience:</span> Explore the cinema-style layout for movies and series with automatic categorization.
                </p>
              </div>
              <div className="flex items-start">
                <svg className="w-3 h-3 text-orange-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
                <p className="text-xs text-gray-300 leading-relaxed">
                  <span className="font-semibold text-orange-400">EPG Integration:</span> See how the Electronic Program Guide displays current and upcoming shows seamlessly.
                </p>
              </div>
              <div className="flex items-start">
                <svg className="w-3 h-3 text-orange-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
                <p className="text-xs text-gray-300 leading-relaxed">
                  <span className="font-semibold text-orange-400">Quick Resume:</span> Experience the convenience of jumping back into your favorite content exactly where you left off.
                </p>
              </div>
            </div>
          </div>

          {/* Right Video */}
          <div className="w-full">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl border border-gray-800">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="MetaPlayer Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
