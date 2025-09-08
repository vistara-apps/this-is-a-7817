import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
let stripePromise = null

// Only initialize if we have a valid key
if (stripePublishableKey && stripePublishableKey !== 'your_stripe_publishable_key') {
  stripePromise = loadStripe(stripePublishableKey)
}

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'usd',
    interval: 'month',
    features: [
      '3 symptom checks per month',
      'Basic condition information',
      'Symptom tracking'
    ],
    limits: {
      symptomChecks: 3,
      dataExport: false,
      prioritySupport: false
    }
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 5,
    currency: 'usd',
    interval: 'month',
    stripePriceId: 'price_premium_monthly', // This would be your actual Stripe price ID
    features: [
      'Unlimited symptom checks',
      'Detailed condition information',
      'Advanced symptom tracking',
      'Data export to PDF',
      'Priority support',
      'Personalized health insights'
    ],
    limits: {
      symptomChecks: -1, // unlimited
      dataExport: true,
      prioritySupport: true
    }
  }
}

// Mock checkout session for demo mode
const mockCheckoutSession = {
  id: 'cs_demo_123',
  url: '#demo-checkout',
  payment_status: 'paid',
  subscription: 'sub_demo_123'
}

// Create checkout session
export const createCheckoutSession = async (priceId, userId, successUrl, cancelUrl) => {
  if (!stripePromise) {
    // Demo mode - return mock session
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      data: mockCheckoutSession,
      error: null
    }
  }

  try {
    // In a real app, this would call your backend API to create the checkout session
    // For now, we'll simulate the process
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl,
        cancelUrl
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const session = await response.json()
    return { data: session, error: null }
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return { data: null, error: error.message }
  }
}

// Redirect to Stripe Checkout
export const redirectToCheckout = async (sessionId) => {
  if (!stripePromise) {
    // Demo mode - show alert instead of redirecting
    alert('Demo Mode: In a real app, this would redirect to Stripe Checkout')
    return { error: null }
  }

  try {
    const stripe = await stripePromise
    const { error } = await stripe.redirectToCheckout({
      sessionId: sessionId,
    })

    return { error }
  } catch (error) {
    console.error('Stripe redirect error:', error)
    return { error: error.message }
  }
}

// Create subscription portal session
export const createPortalSession = async (customerId, returnUrl) => {
  if (!stripePromise) {
    // Demo mode - return mock portal URL
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      data: { url: '#demo-portal' },
      error: null
    }
  }

  try {
    // In a real app, this would call your backend API
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create portal session')
    }

    const session = await response.json()
    return { data: session, error: null }
  } catch (error) {
    console.error('Stripe portal error:', error)
    return { data: null, error: error.message }
  }
}

// Verify subscription status
export const verifySubscription = async (subscriptionId) => {
  if (!stripePromise) {
    // Demo mode - return mock subscription
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      data: {
        id: 'sub_demo_123',
        status: 'active',
        current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
        plan: SUBSCRIPTION_PLANS.PREMIUM
      },
      error: null
    }
  }

  try {
    // In a real app, this would call your backend API
    const response = await fetch(`/api/verify-subscription/${subscriptionId}`)
    
    if (!response.ok) {
      throw new Error('Failed to verify subscription')
    }

    const subscription = await response.json()
    return { data: subscription, error: null }
  } catch (error) {
    console.error('Subscription verification error:', error)
    return { data: null, error: error.message }
  }
}

// Cancel subscription
export const cancelSubscription = async (subscriptionId) => {
  if (!stripePromise) {
    // Demo mode - simulate cancellation
    await new Promise(resolve => setTimeout(resolve, 500))
    return { error: null }
  }

  try {
    // In a real app, this would call your backend API
    const response = await fetch(`/api/cancel-subscription/${subscriptionId}`, {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error('Failed to cancel subscription')
    }

    return { error: null }
  } catch (error) {
    console.error('Subscription cancellation error:', error)
    return { error: error.message }
  }
}

// Get subscription usage
export const getSubscriptionUsage = async (userId) => {
  // This would typically be stored in your database
  // For demo purposes, we'll return mock data
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return {
    data: {
      symptomChecks: {
        used: 2,
        limit: 3,
        resetDate: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)) // 30 days from now
      }
    },
    error: null
  }
}

// Helper function to check if user has access to a feature
export const hasFeatureAccess = (userPlan, feature) => {
  const plan = SUBSCRIPTION_PLANS[userPlan?.toUpperCase()] || SUBSCRIPTION_PLANS.FREE
  
  switch (feature) {
    case 'unlimited_checks':
      return plan.limits.symptomChecks === -1
    case 'data_export':
      return plan.limits.dataExport
    case 'priority_support':
      return plan.limits.prioritySupport
    default:
      return false
  }
}

// Helper function to check usage limits
export const checkUsageLimit = (usage, userPlan, feature) => {
  const plan = SUBSCRIPTION_PLANS[userPlan?.toUpperCase()] || SUBSCRIPTION_PLANS.FREE
  
  switch (feature) {
    case 'symptom_checks':
      if (plan.limits.symptomChecks === -1) return true // unlimited
      return usage.symptomChecks.used < plan.limits.symptomChecks
    default:
      return true
  }
}

export default {
  createCheckoutSession,
  redirectToCheckout,
  createPortalSession,
  verifySubscription,
  cancelSubscription,
  getSubscriptionUsage,
  hasFeatureAccess,
  checkUsageLimit,
  SUBSCRIPTION_PLANS
}
