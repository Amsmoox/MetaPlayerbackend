function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-4 sm:py-6">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Left - Copyright */}
          <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
            © {currentYear} MetaPlayer. All rights reserved.
          </p>

          {/* Right - Links */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <a
              href="/terms"
              className="text-gray-400 hover:text-orange-500 text-xs sm:text-sm transition-colors"
            >
              Terms of online sale
            </a>
            <a
              href="/privacy"
              className="text-gray-400 hover:text-orange-500 text-xs sm:text-sm transition-colors"
            >
              Privacy policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
