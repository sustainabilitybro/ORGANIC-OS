'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect, useCallback, useMemo } from 'react'

// Types
interface ModuleProgress {
  id: string
  module_name: string
  progress_percentage: number
  last_activity: string
  completed_topics: string[]
}

interface WellnessEntry {
  id: string
  date: string
  sleep_hours: number
  water_intake_ml: number
  exercise_minutes: number
  meditation_minutes: number
  mood_score:_level: number
 number
  energy}

interface UseProgressReturn {
  moduleProgress: Record<string, ModuleProgress>
  wellnessEntries: WellnessEntry[]
  loading: boolean
  error: string | null
  updateProgress: (moduleName: string, progress: number, completedTopics?: string[]) => Promise<void>
  addWellnessEntry: (entry: Omit<WellnessEntry, 'id'>) => Promise<void>
  getWellnessStats: () => { avgSleep: number; avgMood: number; avgEnergy: number }
}

// Constants
const STATS_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const MAX_PROGRESS = 100
const VALID_MOOD_RANGE = { min: 0, max: 10 }

export function useProgress(userId: string | null): UseProgressReturn {
  const [moduleProgress, setModuleProgress] = useState<Record<string, ModuleProgress>>({})
  const [wellnessEntries, setWellnessEntries] = useState<WellnessEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<number>(0)

  const supabase = useMemo(() => createClient(), [])

  // Validate userId
  const validUserId = useMemo(() => {
    if (!userId || userId === 'demo-user') return null
    return userId
  }, [userId])

  // Fetch data with caching and error handling
  useEffect(() => {
    if (!validUserId) {
      setLoading(false)
      return
    }

    // Skip if cached recently (5 min)
    if (Date.now() - lastFetch < STATS_CACHE_DURATION) {
      setLoading(false)
      return
    }

    const controller = new AbortController()

    async function fetchData() {
      try {
        setError(null)

        // Fetch module progress with optimized query
        const { data: progressData, error: progressError } = await supabase
          .from('module_progress')
          .select('id, module_name, progress_percentage, last_activity, completed_topics')
          .eq('user_id', validUserId)
          .limit(20) // Only fetch needed fields

        if (progressError) throw progressError

        if (progressData) {
          const progressMap = progressData.reduce((acc, item) => {
            acc[item.module_name] = item
            return acc
          }, {} as Record<string, ModuleProgress>)
          setModuleProgress(progressMap)
        }

        // Fetch wellness entries (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const dateStr = thirtyDaysAgo.toISOString().split('T')[0]

        const { data: wellnessData, error: wellnessError } = await supabase
          .from('wellness_entries')  // Fixed: was 'wellness_tracker'
          .select('id, date, sleep_hours, water_intake_ml, exercise_minutes, meditation_minutes, mood_score, energy_level')
          .eq('user_id', validUserId)
          .gte('date', dateStr)
          .order('date', { ascending: false })
          .limit(30) // Cap at 30 days

        if (wellnessError) throw wellnessError

        if (wellnessData) {
          setWellnessEntries(wellnessData)
        }

        setLastFetch(Date.now())
      } catch (err) {
        console.error('Error fetching progress:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    return () => controller.abort()
  }, [validUserId, supabase, lastFetch])

  // Optimized update with optimistic updates
  const updateProgress = useCallback(async (
    moduleName: string,
    progress: number,
    completedTopics?: string[]
  ) => {
    if (!validUserId) return

    // Validate progress
    const validatedProgress = Math.min(Math.max(progress, 0), MAX_PROGRESS)

    // Optimistic update
    const optimisticUpdate: ModuleProgress = {
      id: moduleProgress[moduleName]?.id || '',
      module_name: moduleName,
      progress_percentage: validatedProgress,
      last_activity: new Date().toISOString(),
      completed_topics: completedTopics || moduleProgress[moduleName]?.completed_topics || [],
    }

    setModuleProgress(prev => ({
      ...prev,
      [moduleName]: optimisticUpdate
    }))

    try {
      const { error } = await supabase
        .from('module_progress')
        .upsert({
          user_id: validUserId,
          module_name: moduleName,
          progress_percentage: validatedProgress,
          completed_topics: completedTopics || [],
          last_activity: new Date().toISOString(),
        }, {
          onConflict: 'user_id, module_name',
          ignoreDuplicates: false,
        })

      if (error) throw error
    } catch (err) {
      console.error('Error updating progress:', err)
      // Revert on error (could implement undo logic here)
      setModuleProgress(prev => prev)
      throw err
    }
  }, [validUserId, moduleProgress])

  // Optimized wellness entry with validation
  const addWellnessEntry = useCallback(async (entry: Omit<WellnessEntry, 'id'>) => {
    if (!validUserId) return

    // Validate fields
    const validatedEntry = {
      ...entry,
      mood_score: entry.mood_score 
        ? Math.min(Math.max(entry.mood_score, VALID_MOOD_RANGE.min), VALID_MOOD_RANGE.max)
        : null,
      sleep_hours: entry.sleep_hours 
        ? Math.min(Math.max(entry.sleep_hours, 0), 24)
        : null,
    }

    try {
      const { error } = await supabase
        .from('wellness_entries')  // Fixed: was 'wellness_tracker'
        .insert({
          user_id: validUserId,
          ...validatedEntry,
        })

      if (error) throw error

      // Update local state
      setWellnessEntries(prev => [
        { ...validatedEntry, id: Date.now().toString() },
        ...prev
      ].slice(0, 30)) // Keep max 30 entries
    } catch (err) {
      console.error('Error adding wellness entry:', err)
      throw err
    }
  }, [validUserId])

  // Memoized stats calculation
  const getWellnessStats = useCallback(() => {
    if (wellnessEntries.length === 0) {
      return { avgSleep: 0, avgMood: 0, avgEnergy: 0 }
    }

    // Use reduce for better performance
    const stats = wellnessEntries.reduce((acc, entry) => ({
      sleep: acc.sleep + (entry.sleep_hours || 0),
      mood: acc.mood + (entry.mood_score || 0),
      energy: acc.energy + (entry.energy_level || 0),
      count: acc.count + 1
    }), { sleep: 0, mood: 0, energy: 0, count: 0 })

    const count = stats.count || 1
    return {
      avgSleep: Math.round((stats.sleep / count) * 10) / 10,
      avgMood: Math.round((stats.mood / count) * 10) / 10,
      avgEnergy: Math.round((stats.energy / count) * 10) / 10,
    }
  }, [wellnessEntries])

  return { 
    moduleProgress, 
    wellnessEntries, 
    loading, 
    error,
    updateProgress, 
    addWellnessEntry, 
    getWellnessStats 
  }
}
