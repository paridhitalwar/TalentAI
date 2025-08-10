'use client'

import { useState, useEffect } from 'react'
import { 
  Menu, 
  X, 
  User, 
  LogIn, 
  UserPlus, 
  Bell,
  Search,
  Sparkles,
  ChevronDown,
  Building,
  UserCheck
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showSignInDropdown, setShowSignInDropdown] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const toggleSignInDropdown = () => {
    setShowSignInDropdown(!showSignInDropdown)
  }

  const closeSignInDropdown = () => {
    setShowSignInDropdown(false)
  }

  const navigation = [
    { name: 'About', href: '/about' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-neutral-200/50' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                TalentAI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="text-neutral-700 hover:text-primary-600 font-medium transition-colors duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search jobs, candidates..."
                className="pl-10 pr-4 py-2 w-64 bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>

            {/* Notifications */}
            {isAuthenticated && (
              <button className="relative p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full animate-pulse"></span>
              </button>
            )}

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Sign In Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleSignInDropdown}
                    onBlur={() => setTimeout(closeSignInDropdown, 200)}
                    className="flex items-center space-x-2 px-4 py-2 text-neutral-700 hover:text-primary-600 font-medium transition-colors duration-200 hover:bg-primary-50 rounded-xl"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showSignInDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showSignInDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
                      <button
                        onClick={() => {
                          closeSignInDropdown()
                          router.push('/recruiter-dashboard')
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-primary-50 transition-colors duration-200"
                      >
                        <Building className="w-4 h-4 text-primary-600" />
                        <span>As Recruiter</span>
                      </button>
                      <button
                        onClick={() => {
                          closeSignInDropdown()
                          router.push('/candidate-dashboard')
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-primary-50 transition-colors duration-200"
                      >
                        <UserCheck className="w-4 h-4 text-secondary-600" />
                        <span>As Candidate</span>
                      </button>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => router.push('/register')}
                  className="btn-primary"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Get Started
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-200">
                  <User className="w-4 h-4 text-neutral-600" />
                  <span className="text-neutral-700 font-medium">Profile</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-neutral-200/50">
          <div className="px-4 py-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search jobs, candidates..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  className="block px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors duration-200 font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Auth */}
            {!isAuthenticated ? (
              <div className="space-y-3 pt-4 border-t border-neutral-200">
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      closeMenu()
                      router.push('/recruiter-dashboard')
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-neutral-700 hover:text-primary-600 font-medium transition-colors duration-200 hover:bg-primary-50 rounded-xl"
                  >
                    <Building className="w-4 h-4" />
                    <span>Sign In as Recruiter</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      closeMenu()
                      router.push('/candidate-dashboard')
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-neutral-700 hover:text-primary-600 font-medium transition-colors duration-200 hover:bg-primary-50 rounded-xl"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Sign In as Candidate</span>
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    closeMenu()
                    router.push('/register')
                  }}
                  className="w-full btn-primary"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Get Started
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-neutral-200">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-neutral-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-200">
                  <User className="w-4 h-4" />
                  <span className="text-neutral-700 font-medium">Profile</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
