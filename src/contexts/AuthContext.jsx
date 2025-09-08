import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  signUp, 
  signIn, 
  signOut, 
  getCurrentUser, 
  getUserProfile,
  updateSubscriptionStatus 
} from '../services/supabaseService'
import { getSubscriptionUsage } from '../services/stripeService'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [usage, setUsage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      setLoading(true)
      const { data, error } = await getCurrentUser()
      
      if (error) {
        console.error('Auth initialization error:', error)
        setError(error.message)
      } else if (data?.user) {
        setUser(data.user)
        await loadUserProfile(data.user.id)
        await loadUsage(data.user.id)
      }
    } catch (err) {
      console.error('Auth initialization failed:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await getUserProfile(userId)
      if (error) {
        console.error('Failed to load user profile:', error)
      } else {
        setUserProfile(data)
      }
    } catch (err) {
      console.error('Profile loading failed:', err)
    }
  }

  const loadUsage = async (userId) => {
    try {
      const { data, error } = await getSubscriptionUsage(userId)
      if (error) {
        console.error('Failed to load usage:', error)
      } else {
        setUsage(data)
      }
    } catch (err) {
      console.error('Usage loading failed:', err)
    }
  }

  const handleSignUp = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await signUp(email, password)
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }
      
      if (data?.user) {
        setUser(data.user)
        await loadUserProfile(data.user.id)
        await loadUsage(data.user.id)
      }
      
      return { success: true, data }
    } catch (err) {
      const errorMessage = err.message || 'Sign up failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await signIn(email, password)
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }
      
      if (data?.user) {
        setUser(data.user)
        await loadUserProfile(data.user.id)
        await loadUsage(data.user.id)
      }
      
      return { success: true, data }
    } catch (err) {
      const errorMessage = err.message || 'Sign in failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await signOut()
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }
      
      // Clear all user state
      setUser(null)
      setUserProfile(null)
      setUsage(null)
      
      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Sign out failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const updateSubscription = async (subscriptionStatus) => {
    try {
      if (!user) return { success: false, error: 'No user logged in' }
      
      const { data, error } = await updateSubscriptionStatus(user.id, subscriptionStatus)
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }
      
      // Update local user profile
      setUserProfile(prev => ({
        ...prev,
        subscription_status: subscriptionStatus
      }))
      
      // Reload usage data
      await loadUsage(user.id)
      
      return { success: true, data }
    } catch (err) {
      const errorMessage = err.message || 'Subscription update failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const refreshUsage = async () => {
    if (user) {
      await loadUsage(user.id)
    }
  }

  const incrementUsage = (feature) => {
    if (!usage) return
    
    setUsage(prev => {
      const updated = { ...prev }
      
      switch (feature) {
        case 'symptom_checks':
          updated.symptomChecks = {
            ...updated.symptomChecks,
            used: updated.symptomChecks.used + 1
          }
          break
        default:
          break
      }
      
      return updated
    })
  }

  const checkUsageLimit = (feature) => {
    if (!usage || !userProfile) return false
    
    const subscriptionStatus = userProfile.subscription_status || 'free'
    
    switch (feature) {
      case 'symptom_checks':
        if (subscriptionStatus === 'premium') return true // unlimited
        return usage.symptomChecks.used < usage.symptomChecks.limit
      default:
        return true
    }
  }

  const hasFeatureAccess = (feature) => {
    if (!userProfile) return false
    
    const subscriptionStatus = userProfile.subscription_status || 'free'
    
    switch (feature) {
      case 'unlimited_checks':
        return subscriptionStatus === 'premium'
      case 'data_export':
        return subscriptionStatus === 'premium'
      case 'priority_support':
        return subscriptionStatus === 'premium'
      default:
        return false
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    // State
    user,
    userProfile,
    usage,
    loading,
    error,
    
    // Auth methods
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    
    // Subscription methods
    updateSubscription,
    refreshUsage,
    incrementUsage,
    checkUsageLimit,
    hasFeatureAccess,
    
    // Utility methods
    clearError,
    
    // Computed values
    isAuthenticated: !!user,
    isPremium: userProfile?.subscription_status === 'premium',
    isDemo: !user || user.id === 'demo-user-123'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
