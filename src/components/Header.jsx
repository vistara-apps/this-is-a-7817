import React from 'react'
import { Activity, User, Crown } from 'lucide-react'

const Header = ({ currentPage, onNavigate, isSubscribed, usageCount }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Activity },
    { id: 'symptom-checker', label: 'Check Symptoms', icon: Activity },
    { id: 'symptom-tracker', label: 'Track Symptoms', icon: Activity },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">Symptom Scout</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
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
              )
            })}
          </nav>

          {/* User Status */}
          <div className="flex items-center space-x-4">
            {!isSubscribed && (
              <div className="text-white/70 text-sm">
                {3 - usageCount} free queries left
              </div>
            )}
            <div className="flex items-center space-x-2">
              {isSubscribed ? (
                <div className="flex items-center space-x-1 bg-yellow-500/20 px-3 py-1 rounded-full">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-medium">Pro</span>
                </div>
              ) : (
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header