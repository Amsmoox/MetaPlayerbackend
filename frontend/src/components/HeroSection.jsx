function HeroSection() {
  return (
    <div className="space-y-5">
      {/* Compact Orange Banner */}
      <div className="bg-orange-500 text-black px-5 py-3 rounded-lg w-fit">
        <p className="text-xs font-bold uppercase tracking-wider">
          MEDIA PLAYER, NO CHANNELS INCLUDED
        </p>
      </div>

      {/* Hero Content - Compact Layout */}
      <div className="space-y-4">
        {/* Headline Section */}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
            Your best Media Player
          </h1>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-500 leading-tight">
            MetaPlayer
          </h1>
        </div>

        {/* Description Section - Compact */}
        <div className="space-y-3 max-w-3xl">
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Experience the ultimate entertainment with <span className="font-semibold text-orange-400">MetaPlayer</span>, your go-to app for enjoying playlists and watching your favorite content. Step into the forefront of media player innovation with <span className="font-semibold text-orange-400">MetaPlayer</span>, a leader in entertainment solutions.
          </p>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Download <span className="font-semibold text-orange-400">MetaPlayer</span> now from the <span className="font-medium text-white">Roku Store</span>, <span className="font-medium text-white">LG TV Store</span>, <span className="font-medium text-white">Samsung TV Store</span>, and <span className="font-medium text-white">Google Play Store</span>, and dive into a new era of entertainment!
          </p>
        </div>

        {/* Compact Disclaimer Box - Important */}
        <div className="bg-red-600/30 rounded-lg p-4 mt-4 flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-black text-sm">!</span>
            </div>
          </div>
          <p className="text-xs text-red-100 leading-normal flex-1">
            No channels are included in the application. MetaPlayer app is not responsible for the content uploaded to it.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
