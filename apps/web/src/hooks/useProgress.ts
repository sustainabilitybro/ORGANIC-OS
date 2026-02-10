'use client'

import { useState, useEffect, useMemo } from 'react'
import { query } from '@/lib/db'

interface WellnessEntry {
  id: string
  date: string
  mood_score?: number
  energy_level?: number
  sleep_hours?: number
}

interface ModuleProgress {
  id: string
  module_name: string
  progress_percentage: number
  last_activity: string
  completed_topics: string[]
}

interface ProgressData {
  streak: number
  weeklyProgress: number
  goalsCompleted: number
  meditationMinutes: number
  level: number
  xp: number
}

export function useProgress(userId: string | null = null) {
  const [loading, setLoading] = useState(true)
  const [wellnessEntries, setWellnessEntries] = useState<WellnessEntry[]>([])
  const [moduleProgress, setModuleProgress] = useState<Record<string, ModuleProgress>>({})
  const [progress, setProgressData] = useState<ProgressData>({
    streak: 0,
    weeklyProgress: 0,
    goalsCompleted: 0,
    meditationMinutes: 0,
    level: 1,
    xp: 0,
  })

  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        // Fetch wellness entries
        const wellnessRes = await fetch(`/api/mood_entries?module=mood_entries`)
        const wellnessData = await wellnessRes.json()
        if (wellnessData.data) {
          setWellnessEntries(wellnessData.data)
        }

        // Fetch user progress
        const progressRes = await fetch(`/api/user_progress?module=user_progress`)
        const progressData = await progressRes.json()
        if (progressData.data && progressData.data.length > 0) {
          const userProgress = progressData.data[0]
          setProgressData({
            streak: userProgress.streak_days || 0,
            weeklyProgress: Math.floor((userProgress.xp_points || 0) / 10) % 100,
            goalsCompleted: 0,
            meditationMinutes: 0,
            level: userProgress.current_level || 1,
            xp: userProgress.xp_points || 0,
          })

          // Build module progress from JSON
          const modules = ['identity', 'sensory', 'emotional', 'wellness', 'recovery', 'communication', 'sustainability']
          const progressMap: Record<string, ModuleProgress> = {}
          modules.forEach((module, i) => {
            progressMap[module] = {
              id: userProgress.id,
              module_name: module,
              progress_percentage: userProgress.achievements ? 
                (userProgress.achievements[`${module}_progress`] || 0) : 0,
              last_activity: userProgress.last_active,
              completed_topics: userProgress.achievements ?
                (userProgress.achievements[`${module}_completed`] || []) : [],
            }
          })
          setModuleProgress(progressMap)
        }
      } catch (error) {
        console.error('Error fetching progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [userId])

  const trackActivity = async (activity: string, data?: any) => {
    if (!userId) return

    try {
      await fetch('/api/mood_entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: 'mood_entries',
          data: {
            user_id: userId,
            mood_score: data?.mood || null,
            journal_entry: activity,
          },
        }),
      })
    } catch (error) {
      console.error('Error tracking activity:', error)
    }
  }

  const getStreak = () => progress.streak

  return {
    progress,
    setProgress: setProgressData,
    loading,
    wellnessEntries,
    moduleProgress,
    trackActivity,
    getStreak,
  }
}
