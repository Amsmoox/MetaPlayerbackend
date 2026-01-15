import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Upload List', path: '/upload-list' },
    { name: 'Activation', path: '/activation' }
  ]
  const utilityItems = ['Reseller', 'Contact-Us']

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/home'
    }
    return location.pathname === path
  }

  return (
    <header className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-b-2 border-orange-500/20 shadow-2xl">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-orange-500/5"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex items-center justify-between">
          {/* Logo Section - Enhanced */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-4 group cursor-pointer">
            {/* Glowing Logo Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform overflow-hidden">
                <img 
                  src="/Logo.png" 
                  alt="MetaPlayer Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            {/* Brand Text */}
            <div className="relative">
              <div className="flex items-baseline space-x-1 sm:space-x-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tighter leading-none">
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    META
                  </span>
                  <span className="text-orange-500 ml-1 sm:ml-2">PLAYER</span>
                </h1>
              </div>
              <div className="hidden sm:flex items-center space-x-2 mt-0.5">
                <div className="h-0.5 w-8 bg-gradient-to-r from-orange-500 to-transparent"></div>
                <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.2em]">
                  Ultra 4K Pro
                </p>
                <div className="h-0.5 w-8 bg-gradient-to-l from-orange-500 to-transparent"></div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Styled */}
          <nav className="hidden md:flex items-center space-x-1 bg-gray-800/50 backdrop-blur-sm rounded-xl px-2 py-2 border border-gray-700/50">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-5 py-2.5 text-sm font-bold transition-all duration-300 rounded-lg ${
                  isActive(item.path)
                    ? 'text-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {isActive(item.path) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent rounded-lg"></div>
                )}
                <span className="relative z-10">{item.name}</span>
                {isActive(item.path) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-orange-500 rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Utility Links - Enhanced */}
          <div className="hidden lg:flex items-center space-x-4">
            {utilityItems.map((item) => (
              <button
                key={item}
                className="text-xs font-semibold text-gray-400 hover:text-orange-500 transition-colors uppercase tracking-wider px-3 py-1.5 rounded-md hover:bg-gray-800/50"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-gray-800/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-2 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-left px-4 py-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'text-orange-500 bg-orange-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-gray-800 pt-2 mt-2">
                {utilityItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left px-4 py-3 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-gray-800/50 transition-colors text-sm uppercase tracking-wider"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
