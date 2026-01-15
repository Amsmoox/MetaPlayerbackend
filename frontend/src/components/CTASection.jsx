function CTASection() {
  return (
    <section className="py-10 mt-8 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 relative overflow-hidden">
      {/* Orange accent lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
      
      {/* Subtle orange glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-orange-500/5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-3 sm:space-y-4 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Ready to dive in?
            </h2>
            <p className="text-base sm:text-lg text-orange-400 font-semibold">
              Start your free 7 days trial today.
            </p>
          </div>

          {/* Right Logo */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl"></div>
              <img 
                src="/Logo.png" 
                alt="MetaPlayer Logo" 
                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 object-contain relative z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
