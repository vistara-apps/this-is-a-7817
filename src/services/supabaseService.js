import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null

// Only initialize if we have valid credentials
if (supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_project_url') {
  supabase = createClient(supabaseUrl, supabaseKey)
}

// Mock data for demo mode
const mockUser = {
  id: 'demo-user-123',
  email: 'demo@example.com',
  subscription_status: 'free',
  created_at: new Date().toISOString()
}

const mockSymptomEntries = [
  {
    id: 'entry-1',
    user_id: 'demo-user-123',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    reported_symptoms: 'Headache, fatigue, mild fever',
    severity: 'moderate',
    notes: 'Started yesterday morning',
    potential_conditions: ['Common Cold', 'Flu', 'Stress'],
    urgency_assessment: 'Low'
  },
  {
    id: 'entry-2',
    user_id: 'demo-user-123',
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    reported_symptoms: 'Sore throat, cough',
    severity: 'mild',
    notes: 'Dry cough, worse in morning',
    potential_conditions: ['Viral Infection', 'Allergies'],
    urgency_assessment: 'Low'
  }
]

const mockTreatmentLogs = [
  {
    id: 'treatment-1',
    user_id: 'demo-user-123',
    timestamp: new Date().toISOString(),
    symptom_entry_id: 'entry-1',
    treatment: 'Rest and hydration',
    effectiveness: 7,
    notes: 'Feeling better after rest'
  }
]

// Authentication functions
export const signUp = async (email, password) => {
  if (!supabase) {
    // Demo mode - simulate successful signup
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { 
      data: { user: mockUser }, 
      error: null 
    }
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export const signIn = async (email, password) => {
  if (!supabase) {
    // Demo mode - simulate successful signin
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { 
      data: { user: mockUser }, 
      error: null 
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export const signOut = async () => {
  if (!supabase) {
    // Demo mode - simulate successful signout
    await new Promise(resolve => setTimeout(resolve, 500))
    return { error: null }
  }

  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    return { error }
  }
}

export const getCurrentUser = async () => {
  if (!supabase) {
    // Demo mode - return mock user
    return { data: { user: mockUser }, error: null }
  }

  try {
    const { data, error } = await supabase.auth.getUser()
    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

// Symptom entry functions
export const createSymptomEntry = async (entryData) => {
  if (!supabase) {
    // Demo mode - simulate creating entry
    await new Promise(resolve => setTimeout(resolve, 500))
    const newEntry = {
      id: `entry-${Date.now()}`,
      user_id: mockUser.id,
      timestamp: new Date().toISOString(),
      ...entryData
    }
    return { data: newEntry, error: null }
  }

  try {
    const { data, error } = await supabase
      .from('symptom_entries')
      .insert([entryData])
      .select()
      .single()
    
    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export const getSymptomEntries = async (userId, limit = 50) => {
  if (!supabase) {
    // Demo mode - return mock entries
    await new Promise(resolve => setTimeout(resolve, 300))
    return { data: mockSymptomEntries, error: null }
  }

  try {
    const { data, error } = await supabase
      .from('symptom_entries')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit)
    
    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export const updateSymptomEntry = async (entryId, updates) => {
  if (!supabase) {
    // Demo mode - simulate update
    await new Promise(resolve => setTimeout(resolve, 300))
    return { data: { ...mockSymptomEntries[0], ...updates }, error: null }
  }

  try {
    const { data, error } = await supabase
      .from('symptom_entries')
      .update(updates)
      .eq('id', entryId)
      .select()
      .single()
    
    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export const deleteSymptomEntry = async (entryId) => {
  if (!supabase) {
    // Demo mode - simulate deletion
    await new Promise(resolve => setTimeout(resolve, 300))
    return { error: null }
  }

  try {
    const { error } = await supabase
      .from('symptom_entries')
      .delete()
      .eq('id', entryId)
    
    return { error }
  } catch (error) {
    return { error }
  }
}

// Treatment log functions
export const createTreatmentLog = async (logData) => {
  if (!supabase) {
    // Demo mode - simulate creating log
    await new Promise(resolve => setTimeout(resolve, 300))
    const newLog = {
      id: `treatment-${Date.now()}`,
      user_id: mockUser.id,
      timestamp: new Date().toISOString(),
      ...logData
    }
    return { data: newLog, error: null }
  }

  try {
    const { data, error } = await supabase
      .from('treatment_logs')
      .insert([logData])
      .select()
      .single()
    
    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export const getTreatmentLogs = async (userId, symptomEntryId = null) => {
  if (!supabase) {
    // Demo mode - return mock logs
    await new Promise(resolve => setTimeout(resolve, 300))
    const filteredLogs = symptomEntryId 
      ? mockTreatmentLogs.filter(log => log.symptom_entry_id === symptomEntryId)
      : mockTreatmentLogs
    return { data: filteredLogs, error: null }
  }

  try {
    let query = supabase
      .from('treatment_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })

    if (symptomEntryId) {
      query = query.eq('symptom_entry_id', symptomEntryId)
    }

    const { data, error } = await query
    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

// User profile functions
export const updateUserProfile = async (userId, updates) => {
  if (!supabase) {
    // Demo mode - simulate update
    await new Promise(resolve => setTimeout(resolve, 300))
    return { data: { ...mockUser, ...updates }, error: null }
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export const getUserProfile = async (userId) => {
  if (!supabase) {
    // Demo mode - return mock user
    await new Promise(resolve => setTimeout(resolve, 200))
    return { data: mockUser, error: null }
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

// Subscription functions
export const updateSubscriptionStatus = async (userId, subscriptionStatus) => {
  if (!supabase) {
    // Demo mode - simulate update
    await new Promise(resolve => setTimeout(resolve, 300))
    return { data: { ...mockUser, subscription_status: subscriptionStatus }, error: null }
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .update({ subscription_status: subscriptionStatus })
      .eq('id', userId)
      .select()
      .single()
    
    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

// Export the supabase client for direct use if needed
export { supabase }
