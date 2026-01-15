import { useState } from 'react'

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "What is MetaPlayer?",
      answer: "MetaPlayer is a professional media player application designed for streaming Live TV, Movies, and Series. It supports M3U playlists and XtreamCode servers, providing a seamless entertainment experience with features like EPG (Electronic Program Guide), favorites, and quick resume functionality."
    },
    {
      question: "How do I get started with MetaPlayer?",
      answer: "Getting started is easy! Download MetaPlayer from your device's app store, install it, and you'll receive a unique MAC address. You can then upload your M3U playlist or XtreamCode server details through our backend portal. The app includes a 7-day free trial to explore all features."
    },
    {
      question: "What playlist formats does MetaPlayer support?",
      answer: "MetaPlayer supports all standard M3U playlist formats and XtreamCode API servers. The app automatically detects and categorizes your content into Live TV, Movies, and Series. You can upload your playlist through our web portal, and it will be automatically synced to your device."
    },
    {
      question: "How does the free trial work?",
      answer: "Every new device receives a 7-day free trial automatically upon first registration. During this period, you have full access to all MetaPlayer features. After 7 days, you'll need to activate your device with either a Yearly (4.99€) or Lifetime (13.99€) license to continue using the app."
    },
    {
      question: "What happens if I uninstall and reinstall the app?",
      answer: "Your device MAC address remains the same even after uninstalling and reinstalling the app. This means your activation status, playlist, and preferences are preserved. Simply reinstall the app and log in with the same device to restore your settings."
    },
    {
      question: "Can I use MetaPlayer on multiple devices?",
      answer: "Each device has its own unique MAC address and requires separate activation. You can activate multiple devices, but each one needs its own license. Contact us for reseller packages if you need to manage multiple devices."
    },
    {
      question: "Does MetaPlayer provide content or channels?",
      answer: "No, MetaPlayer is a media player application only. We do not provide, sell, or distribute any content, channels, or IPTV subscriptions. Users must supply their own M3U playlists or XtreamCode server credentials. MetaPlayer is not responsible for the content uploaded to it."
    },
    {
      question: "What platforms is MetaPlayer available on?",
      answer: "MetaPlayer is available on multiple platforms including Samsung Smart TV, LG webOS, Android, Fire TV Stick, VIDAA, Roku, Microsoft Store, App Store, Whale TV, and Titan OS. Check our Available Platforms section for the complete list."
    },
    {
      question: "How does the EPG (Electronic Program Guide) work?",
      answer: "MetaPlayer automatically detects and integrates EPG data from XMLTV sources. If your M3U playlist includes EPG information or tvg-ID attributes, the app will match and display current and upcoming program schedules for your live channels automatically."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods through our secure payment portal. Payments are processed securely, and upon successful payment, your device activation is processed immediately. For reseller inquiries or bulk purchases, please contact us directly."
    },
    {
      question: "How do I contact support?",
      answer: "For technical support, activation issues, or general inquiries, you can reach us through the Contact Us page on our website. We also offer reseller support for those interested in our reseller packages with exceptional discounts."
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yearly subscriptions are valid for 12 months from the activation date. Lifetime licenses are one-time payments with no expiration. If you have specific questions about refunds or cancellations, please contact our support team for assistance."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-10 mt-8 relative overflow-hidden">
      {/* Orange accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
      
      {/* Subtle orange glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-orange-500/5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">
          Frequently Asked Questions
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-800"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left py-3 sm:py-4 flex items-center justify-between hover:text-orange-400 transition-colors"
              >
                <span className="text-base sm:text-lg font-semibold text-white pr-4 sm:pr-8">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-orange-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="pb-4">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
