import React, { useState } from 'react'
import { Activity, User, Crown, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Header = ({ currentPage, onNavigate, onShowAuth }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { 
    isAuthenticated, 
    isPremium, 
    user, 
    usage, 
    signOut 
  } = useAuth()

  const navItems = [
    { id: 'home', label: 'Home', icon: Activity },
    { id: 'symptom-checker', label: 'Check Symptoms', icon: Activity },
    { id: 'symptom-tracker', label: 'Track Symptoms', icon: Activity },
  ]

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
    onNavigate('home')
  }

  const remainingQueries = usage?.symptomChecks ? 
    Math.max(0, usage.symptomChecks.limit - usage.symptomChecks.used) : 3

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-primary/90 backdrop-blur-sm shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">Symptom Scout</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Status */}
          <div className="flex items-center space-x-4">
            {/* Usage Counter */}
            {!isPremium && isAuthenticated && (
              <div className="text-white/70 text-sm">
                {remainingQueries} free queries left
              </div>
            )}

            {/* User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  {/* Premium Badge */}
                  {isPremium && (
                    <div className="flex items-center space-x-1 bg-yellow-500/20 px-3 py-1 rounded-full">
                      <Crown className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm font-medium">Premium</span>
                    </div>
                  )}

                  {/* User Menu Button */}
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white text-sm hidden sm:block">
                      {user?.email?.split('@')[0] || 'User'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-white/70" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isPremium ? 'Premium Account' : 'Free Account'}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          // Add settings navigation if needed
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onShowAuth('signin')}
                  className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <User className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  )
}

export default Header
