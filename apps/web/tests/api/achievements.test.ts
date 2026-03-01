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
      const entries = [
        { date: '2026-03-01', mood: 7 },
        { date: '2026-02-28', mood: 6 },
        { date: '2026-02-27', mood: 5 },
      ]
      expect(calculateStreak(entries)).toBe(3)
    })

    it('should return 0 for no entries', () => {
      expect(calculateStreak([])).toBe(0)
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
      const achievements = [
        { id: 'streak_3', name: '3 Day', requirement: 3, type: 'streak' as const },
      ]
      const unlocked = checkBadges(5, 0, achievements)
      expect(unlocked).toHaveLength(1)
    })

    it('should not unlock if requirements not met', () => {
      const achievements = [
        { id: 'streak_7', name: '7 Day', requirement: 7, type: 'streak' as const },
      ]
      const unlocked = checkBadges(3, 0, achievements)
      expect(unlocked).toHaveLength(0)
    })
  })

  describe('Points System', () => {
    const calculatePoints = (
      streak: number,
      modulesCompleted: number,
      entries: number
    ): number => {
      return (
        streak * 10 +
        modulesCompleted * 50 +
        entries * 5
      )
    }

    it('should calculate points correctly', () => {
      // 5*10 + 2*50 + 10*5 = 50 + 100 + 50 = 200
      const points = calculatePoints(5, 2, 10)
      expect(points).toBe(200)
    })

    it('should return 0 for no activity', () => {
      expect(calculatePoints(0, 0, 0)).toBe(0)
    })
  })
})
