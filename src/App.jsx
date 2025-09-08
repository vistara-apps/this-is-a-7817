import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import HomePage from './components/HomePage'
import SymptomChecker from './components/SymptomChecker'
import SymptomTracker from './components/SymptomTracker'
import ConditionInfo from './components/ConditionInfo'
import SubscriptionModal from './components/SubscriptionModal'
import { useLocalStorage } from './hooks/useLocalStorage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isSubscribed, setIsSubscribed] = useLocalStorage('isSubscribed', false)
  const [usageCount, setUsageCount] = useLocalStorage('usageCount', 0)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [selectedCondition, setSelectedCondition] = useState(null)

  const handlePageChange = (page, data = null) => {
    setCurrentPage(page)
    if (page === 'condition-info' && data) {
      setSelectedCondition(data)
    }
  }

  const checkUsageLimit = () => {
    if (!isSubscribed && usageCount >= 3) {
      setShowSubscriptionModal(true)
      return false
    }
    return true
  }

  const incrementUsage = () => {
    if (!isSubscribed) {
      setUsageCount(prev => prev + 1)
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'symptom-checker':
        return (
          <SymptomChecker 
            onNavigate={handlePageChange}
            checkUsageLimit={checkUsageLimit}
            incrementUsage={incrementUsage}
            isSubscribed={isSubscribed}
            usageCount={usageCount}
          />
        )
      case 'symptom-tracker':
        return <SymptomTracker onNavigate={handlePageChange} />
      case 'condition-info':
        return (
          <ConditionInfo 
            condition={selectedCondition}
            onNavigate={handlePageChange}
          />
        )
      default:
        return <HomePage onNavigate={handlePageChange} />
    }
  }

  return (
    <div className="min-h-screen">
      <Header 
        currentPage={currentPage}
        onNavigate={handlePageChange}
        isSubscribed={isSubscribed}
        usageCount={usageCount}
      />
      <main className="pt-20">
        {renderCurrentPage()}
      </main>
      
      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={() => {
            setIsSubscribed(true)
            setShowSubscriptionModal(false)
          }}
        />
      )}
    </div>
  )
}

export default App