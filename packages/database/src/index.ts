import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for the database schema
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  bio?: string
  timezone?: string
  preferences?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ModuleProgress {
  id: string
  user_id: string
  module_name: string
  progress_percentage: number
  last_activity: string
  completed_topics: string[]
  created_at: string
  updated_at: string
}

export interface UserEntry {
  id: string
  user_id: string
  module_name: string
  topic_name: string
  entry_type: string
  content: Record<string, unknown>
  ai_insights?: Record<string, unknown>
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export interface CoreValue {
  id: string
  user_id: string
  value_name: string
  description?: string
  importance_score?: number
  examples?: string
  created_at: string
}

export interface LifePurpose {
  id: string
  user_id: string
  draft_number: number
  draft_content: string
  ai_feedback?: string
  is_finalized: boolean
  created_at: string
}

export interface EmotionsJournal {
  id: string
  user_id: string
  emotion_name: string
  intensity: number
  triggers?: string
  bodily_sensations?: string
  thoughts?: string
  behaviors?: string
  regulation_strategy_used?: string
  ai_suggestions?: Record<string, unknown>
  created_at: string
}

export interface WellnessTracker {
  id: string
  user_id: string
  date: string
  sleep_hours?: number
  water_intake?: number
  exercise_minutes?: number
  mood_score?: number
  energy_level?: number
  stress_level?: number
  notes?: string
  created_at: string
}

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '')
}

// Auth helpers
export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password })
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
