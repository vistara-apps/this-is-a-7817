import React, { useState } from 'react'
import { X, Crown, Check, Loader2, AlertCircle } from 'lucide-react'
import Button from './ui/Button'
import Modal from './ui/Modal'
import { useAuth } from '../contexts/AuthContext'
import { createCheckoutSession, redirectToCheckout, SUBSCRIPTION_PLANS } from '../services/stripeService'

const SubscriptionModal = ({ onClose, onSubscribe }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const { user, isAuthenticated, updateSubscription } = useAuth()

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      setError('Please sign in to upgrade your subscription')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const appUrl = import.meta.env.VITE_APP_URL || window.location.origin
      const successUrl = `${appUrl}?subscription=success`
      const cancelUrl = `${appUrl}?subscription=cancelled`

      // Create checkout session
      const { data: session, error: sessionError } = await createCheckoutSession(
        SUBSCRIPTION_PLANS.PREMIUM.stripePriceId,
        user.id,
        successUrl,
        cancelUrl
      )

      if (sessionError) {
        throw new Error(sessionError)
      }

      if (session.url === '#demo-checkout') {
        // Demo mode - simulate successful subscription
        await updateSubscription('premium')
        onSubscribe()
        onClose()
        return
      }

      // Redirect to Stripe Checkout
      const { error: redirectError } = await redirectToCheckout(session.id)
      
      if (redirectError) {
        throw new Error(redirectError)
      }

    } catch (err) {
      console.error('Subscription error:', err)
      setError(err.message || 'Failed to process subscription. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-text-primary">Upgrade to Premium</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <div className="mb-6">
          <p className="text-text-secondary mb-4">
            You've reached your free usage limit. Upgrade to Premium for unlimited access and advanced features.
          </p>
          
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-text-primary">Premium Plan</span>
              <span className="text-2xl font-bold text-primary">
                ${SUBSCRIPTION_PLANS.PREMIUM.price}/{SUBSCRIPTION_PLANS.PREMIUM.interval}
              </span>
            </div>
            
            <ul className="space-y-2">
              {SUBSCRIPTION_PLANS.PREMIUM.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-text-secondary">
                  <Check className="w-4 h-4 text-accent flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Authentication Notice */}
        {!isAuthenticated && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              Please sign in to upgrade your subscription and sync your data across devices.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isProcessing}
          >
            Maybe Later
          </Button>
          <Button
            variant="primary"
            onClick={handleUpgrade}
            className="flex-1"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </>
            )}
          </Button>
        </div>

        {/* Demo Mode Notice */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-700">
            <strong>Demo Mode:</strong> This will simulate a successful subscription upgrade without actual payment processing.
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default SubscriptionModal
