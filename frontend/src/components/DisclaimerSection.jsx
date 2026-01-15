import { Link } from 'react-router-dom'

function DisclaimerSection() {
  return (
    <section className="bg-red-50/10 border-t border-red-200/20 mt-8 sm:mt-12">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Disclaimer</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left side - Text content */}
          <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
            <p>
              We have discovered unauthorized websites that replicate our platform and misuse our brand name to promote IPTV subscription services. These websites are not associated with MetaPlayer, and we do not support or acknowledge any business conducted through them.
            </p>
            <p>
              MetaPlayer functions exclusively as a media player application. We do not offer, sell, or distribute IPTV subscriptions, channels, or any form of content. MetaPlayer does not provide audiovisual content to users, maintains no relationships with third-party content providers, and requires users to supply their own content sources.
            </p>
            <Link 
              to="/disclaimer" 
              className="inline-block text-orange-400 hover:text-orange-500 text-sm font-medium mt-2 transition-colors"
            >
              Read more about this →
            </Link>
          </div>

          {/* Right side - Bullet points with SVG arrows */}
          <div className="space-y-3">
            <div className="flex items-start">
              <svg className="w-4 h-4 text-red-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-red-400 text-sm">MetaPlayer does not provide or solicit any audiovisual content to users.</span>
            </div>
            <div className="flex items-start">
              <svg className="w-4 h-4 text-red-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-red-400 text-sm">MetaPlayer maintains absolutely no connections with third-party providers.</span>
            </div>
            <div className="flex items-start">
              <svg className="w-4 h-4 text-red-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-red-400 text-sm">Users are required to supply their own content.</span>
            </div>
            <div className="flex items-start">
              <svg className="w-4 h-4 text-red-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-red-400 text-sm">We do not engage in the sale of IPTV subscriptions or channel packages.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DisclaimerSection
