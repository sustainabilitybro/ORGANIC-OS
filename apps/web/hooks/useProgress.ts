'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'

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
  mood_score: number
  energy_level: number
}

interface UseProgressReturn {
  moduleProgress: Record<string, ModuleProgress>
  wellnessEntries: WellnessEntry[]
  loading: boolean
  updateProgress: (moduleName: string, progress: number, completedTopics?: string[]) => Promise<void>
  addWellnessEntry: (entry: Omit<WellnessEntry, 'id'>) => Promise<void>
  getWellnessStats: () => { avgSleep: number; avgMood: number; avgEnergy: number }
}

export function useProgress(userId: string | null): UseProgressReturn {
  const [moduleProgress, setModuleProgress] = useState<Record<string, ModuleProgress>>({})
  const [wellnessEntries, setWellnessEntries] = useState<WellnessEntry[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    async function fetchData() {
      // Fetch module progress
      const { data: progressData } = await supabase
        .from('module_progress')
        .select('*')
        .eq('user_id', userId)

      if (progressData) {
        const progressMap = progressData.reduce((acc, item) => {
          acc[item.module_name] = item
          return acc
        }, {})
        setModuleProgress(progressMap)
      }

      // Fetch wellness entries (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const { data: wellnessData } = await supabase
        .from('wellness_tracker')
        .select('*')
        .eq('user_id', userId)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true })

      if (wellnessData) {
        setWellnessEntries(wellnessData)
      }

      setLoading(false)
    }

    fetchData()
  }, [userId])

  const updateProgress = async (moduleName: string, progress: number, completedTopics?: string[]) => {
    if (!userId) return

    const { error } = await supabase
      .from('module_progress')
      .upsert({
        user_id: userId,
        module_name: moduleName,
        progress_percentage: progress,
        completed_topics: completedTopics || [],
        last_activity: new Date().toISOString(),
      }, {
        onConflict: 'user_id, module_name',
      })

    if (!error) {
      setModuleProgress(prev => ({
        ...prev,
        [moduleName]: {
          ...prev[moduleName],
          module_name: moduleName,
          progress_percentage: progress,
          completed_topics: completedTopics || prev[moduleName]?.completed_topics || [],
          last_activity: new Date().toISOString(),
        }
      }))
    }
  }

  const addWellnessEntry = async (entry: Omit<WellnessEntry, 'id'>) => {
    if (!userId) return

    const { error } = await supabase
      .from('wellness_tracker')
      .insert({
        user_id: userId,
        ...entry,
      })

    if (!error) {
      setWellnessEntries(prev => [...prev, { ...entry, id: Date.now().toString() }])
    }
  }

  const getWellnessStats = () => {
    if (wellnessEntries.length === 0) {
      return { avgSleep: 0, avgMood: 0, avgEnergy: 0 }
    }

    const avgSleep = wellnessEntries.reduce((sum, e) => sum + (e.sleep_hours || 0), 0) / wellnessEntries.length
    const avgMood = wellnessEntries.reduce((sum, e) => sum + (e.mood_score || 0), 0) / wellnessEntries.length
    const avgEnergy = wellnessEntries.reduce((sum, e) => sum + (e.energy_level || 0), 0) / wellnessEntries.length

    return {
      avgSleep: Math.round(avgSleep * 10) / 10,
      avgMood: Math.round(avgMood * 10) / 10,
      avgEnergy: Math.round(avgEnergy * 10) / 10,
    }
  }

  return { moduleProgress, wellnessEntries, loading, updateProgress, addWellnessEntry, getWellnessStats }
}
