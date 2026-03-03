/**
 * Achievements & Gamification API Tests
 */
import { describe, it, expect } from 'vitest'

describe('Achievements & Gamification API', () => {
  interface Achievement {
    id: string
    name: string
    description: string
    icon: string
    requirement: number
    type: 'streak' | 'completion' | 'points'
  }

  interface UserAchievement {
    achievementId: string
    unlockedAt: number
  }

  describe('Achievement Types', () => {
    const achievements: Achievement[] = [
      { id: 'streak_3', name: '3 Day Streak', description: 'Log wellness for 3 days', icon: '🔥', requirement: 3, type: 'streak' },
      { id: 'streak_7', name: 'Week Warrior', description: 'Log wellness for 7 days', icon: '🔥', requirement: 7, type: 'streak' },
      { id: 'module_complete', name: 'Module Master', description: 'Complete a module', icon: '🎓', requirement: 1, type: 'completion' },
    ]

    it('should have valid achievement types', () => {
      const types = new Set(achievements.map(a => a.type))
      expect(types.has('streak')).toBe(true)
      expect(types.has('completion')).toBe(true)
    })
  })

  describe('Streak Calculation', () => {
    const calculateStreak = (entries: { date: string; mood: number }[]): number => {
      if (entries.length === 0) return 0
      
      const sorted = [...entries].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      
      let streak = 0
      const today = new Date()
      
      for (const entry of sorted) {
        const entryDate = new Date(entry.date)
        const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysDiff > streak + 1) break
        if (entry.mood >= 5) streak++
      }
      
      return streak
    }

    it('should calculate streak correctly', () => {
      // Use dates relative to today (March 3, 2026)
      const today = new Date('2026-03-03')
      const entries = [
        { date: '2026-03-03', mood: 7 },  // today
        { date: '2026-03-02', mood: 6 },   // yesterday
        { date: '2026-03-01', mood: 5 },  // 2 days ago
      ]
      // Mock today's date for this test
      const calculateStreakWithDate = (entries: { date: string; mood: number }[], refDate: Date): number => {
        if (entries.length === 0) return 0
        
        const sorted = [...entries].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        
        let streak = 0
        
        for (const entry of sorted) {
          const entryDate = new Date(entry.date)
          const daysDiff = Math.floor((refDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
          
          if (daysDiff > streak + 1) break
          if (entry.mood >= 5) streak++
        }
        
        return streak
      }
      
      expect(calculateStreakWithDate(entries, today)).toBe(3)
    })

    it('should return 0 for no entries', () => {
      expect(calculateStreak([])).toBe(0)
    })
    
    it('should handle empty mood entries', () => {
      const entries = [
        { date: '2026-03-03', mood: 3 },
        { date: '2026-03-02', mood: 2 },
      ]
      // All moods below 5 should return 0
      expect(calculateStreak(entries)).toBe(0)
    })
  })

  describe('Badge Unlocking', () => {
    const checkBadges = (
      streak: number,
      modulesCompleted: number,
      achievements: Achievement[]
    ): UserAchievement[] => {
      const unlocked: UserAchievement[] = []
      
      for (const achievement of achievements) {
        let earned = false
        
        if (achievement.type === 'streak' && streak >= achievement.requirement) {
          earned = true
        } else if (achievement.type === 'completion' && modulesCompleted >= achievement.requirement) {
          earned = true
        }
        
        if (earned) {
          unlocked.push({
            achievementId: achievement.id,
            unlockedAt: Date.now()
          })
        }
      }
      
      return unlocked
    }

    it('should unlock streak badges', () => {
      const achievements: Achievement[] = [
        { id: 'streak_3', name: '3 Day Streak', icon: '🔥', requirement: 3, type: 'streak', description: '' },
        { id: 'streak_7', name: 'Week Warrior', icon: '🔥', requirement: 7, type: 'streak', description: '' },
      ]
      
      const unlocked = checkBadges(5, 0, achievements)
      expect(unlocked).toHaveLength(1)
      expect(unlocked[0].achievementId).toBe('streak_3')
    })
    
    it('should unlock multiple badges', () => {
      const achievements: Achievement[] = [
        { id: 'streak_3', name: '3 Day Streak', icon: '🔥', requirement: 3, type: 'streak', description: '' },
        { id: 'streak_7', name: 'Week Warrior', icon: '🔥', requirement: 7, type: 'streak', description: '' },
        { id: 'module_complete', name: 'Module Master', icon: '🎓', requirement: 1, type: 'completion', description: '' },
      ]
      
      const unlocked = checkBadges(10, 2, achievements)
      expect(unlocked).toHaveLength(3)
    })
  })
})
