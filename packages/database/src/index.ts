// Database types and helpers for Organic OS
// This module provides TypeScript types and can be used with Supabase when credentials are configured

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

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  if (typeof window === 'undefined') return false
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '')
}

// Supabase client - only import when needed
let _supabase: any = null

export async function getSupabase() {
  if (!_supabase) {
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    _supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
}

export const supabase = {
  async auth() {
    const client = await getSupabase()
    return client.auth
  },
  async from(table: string) {
    const client = await getSupabase()
    return client.from(table)
  }
}
