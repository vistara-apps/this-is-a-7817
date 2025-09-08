import React, { useState } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import HomePage from './components/HomePage'
import SymptomChecker from './components/SymptomChecker'
import SymptomTracker from './components/SymptomTracker'
import ConditionInfo from './components/ConditionInfo'
import SubscriptionModal from './components/SubscriptionModal'
import AuthModal from './components/auth/AuthModal'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home')
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('signin')
  const [selectedCondition, setSelectedCondition] = useState(null)

  const handlePageChange = (page, data = null) => {
    setCurrentPage(page)
    if (page === 'condition-info' && data) {
      setSelectedCondition(data)
    }
  }

  const handleShowAuth = (mode = 'signin') => {
    setAuthModalMode(mode)
    setShowAuthModal(true)
  }

  const handleShowSubscription = () => {
    setShowSubscriptionModal(true)
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'symptom-checker':
        return (
          <SymptomChecker 
            onNavigate={handlePageChange}
            onShowAuth={handleShowAuth}
            onShowSubscription={handleShowSubscription}
          />
        )
      case 'symptom-tracker':
        return (
          <SymptomTracker 
            onNavigate={handlePageChange}
            onShowAuth={handleShowAuth}
          />
        )
      case 'condition-info':
        return (
          <ConditionInfo 
            condition={selectedCondition}
            onNavigate={handlePageChange}
          />
        )
      default:
        return (
          <HomePage 
            onNavigate={handlePageChange}
            onShowAuth={handleShowAuth}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header 
        currentPage={currentPage}
        onNavigate={handlePageChange}
        onShowAuth={handleShowAuth}
      />
      <main className="pt-20">
        {renderCurrentPage()}
      </main>
      
      {/* Modals */}
      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={() => {
            setShowSubscriptionModal(false)
          }}
        />
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authModalMode}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
