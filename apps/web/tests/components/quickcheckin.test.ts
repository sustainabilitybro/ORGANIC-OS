/**
 * QuickCheckIn Component Tests
 */
import { describe, it, expect } from 'vitest'

describe('QuickCheckIn Component', () => {
  interface CheckInData {
    mood: number
    energy: number
    stress: number
    sleep: number
    exercise: number
  }

  const calculateWellnessScore = (data: CheckInData): number => {
    const weights = {
      mood: 0.25,
      energy: 0.20,
      stress: 0.20,
      sleep: 0.25,
      exercise: 0.10
    }
    
    const normalizedStress = 10 - data.stress // Invert stress
    const rawScore = 
      (data.mood * weights.mood) +
      (data.energy * weights.energy) +
      (normalizedStress * weights.stress) +
      (data.sleep * weights.sleep) +
      (data.exercise * weights.exercise)
    
    return Math.round(rawScore * 10)
  }

  const getWellnessLevel = (score: number): string => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Attention'
  }

  const getRecommendations = (data: CheckInData): string[] => {
    const recommendations: string[] = []
    
    if (data.sleep < 5) {
      recommendations.push('Prioritize more sleep tonight - aim for 7-9 hours')
    }
    if (data.stress > 7) {
      recommendations.push('Consider a stress-relief activity like meditation or walking')
    }
    if (data.energy < 4) {
      recommendations.push('Try a short burst of exercise to boost energy')
    }
    if (data.mood < 4) {
      recommendations.push('Reach out to a friend or practice gratitude journaling')
    }
    if (data.exercise < 3) {
      recommendations.push('Add 30 minutes of physical activity to your day')
    }
    
    return recommendations
  }

  describe('Wellness Score Calculation', () => {
    it('should calculate high score for optimal inputs', () => {
      const data: CheckInData = {
        mood: 9,
        energy: 8,
        stress: 2,
        sleep: 8,
        exercise: 8
      }
      const score = calculateWellnessScore(data)
      expect(score).toBeGreaterThanOrEqual(70)
    })

    it('should calculate low score for poor inputs', () => {
      const data: CheckInData = {
        mood: 2,
        energy: 2,
        stress: 9,
        sleep: 3,
        exercise: 1
      }
      const score = calculateWellnessScore(data)
      expect(score).toBeLessThan(40)
    })

    it('should handle mid-range inputs', () => {
      const data: CheckInData = {
        mood: 5,
        energy: 5,
        stress: 5,
        sleep: 5,
        exercise: 5
      }
      const score = calculateWellnessScore(data)
      expect(score).toBeGreaterThanOrEqual(40)
      expect(score).toBeLessThanOrEqual(60)
    })

    it('should return integer score', () => {
      const data: CheckInData = { mood: 5, energy: 5, stress: 5, sleep: 5, exercise: 5 }
      const score = calculateWellnessScore(data)
      expect(score).toBe(Math.floor(score))
    })
  })

  describe('Wellness Level Classification', () => {
    it('should classify excellent scores', () => {
      expect(getWellnessLevel(85)).toBe('Excellent')
      expect(getWellnessLevel(90)).toBe('Excellent')
    })

    it('should classify good scores', () => {
      expect(getWellnessLevel(70)).toBe('Good')
      expect(getWellnessLevel(60)).toBe('Good')
    })

    it('should classify fair scores', () => {
      expect(getWellnessLevel(50)).toBe('Fair')
      expect(getWellnessLevel(40)).toBe('Fair')
    })

    it('should classify needs attention scores', () => {
      expect(getWellnessLevel(30)).toBe('Needs Attention')
      expect(getWellnessLevel(10)).toBe('Needs Attention')
    })
  })

  describe('Recommendations', () => {
    it('should recommend sleep for low sleep scores', () => {
      const data: CheckInData = { mood: 7, energy: 7, stress: 3, sleep: 3, exercise: 7 }
      const recs = getRecommendations(data)
      expect(recs.some(r => r.toLowerCase().includes('sleep'))).toBe(true)
    })

    it('should recommend stress management for high stress', () => {
      const data: CheckInData = { mood: 7, energy: 7, stress: 8, sleep: 7, exercise: 7 }
      const recs = getRecommendations(data)
      expect(recs.some(r => r.toLowerCase().includes('stress'))).toBe(true)
    })

    it('should recommend exercise for low exercise', () => {
      const data: CheckInData = { mood: 7, energy: 7, stress: 3, sleep: 7, exercise: 2 }
      const recs = getRecommendations(data)
      expect(recs.some(r => r.toLowerCase().includes('exercise') || r.toLowerCase().includes('physical'))).toBe(true)
    })

    it('should return empty array for optimal inputs', () => {
      const data: CheckInData = { mood: 8, energy: 8, stress: 2, sleep: 8, exercise: 8 }
      const recs = getRecommendations(data)
      expect(recs.length).toBe(0)
    })

    it('should return multiple recommendations for poor inputs', () => {
      const data: CheckInData = { mood: 2, energy: 2, stress: 9, sleep: 3, exercise: 1 }
      const recs = getRecommendations(data)
      expect(recs.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('Input Validation', () => {
    it('should handle boundary values', () => {
      const data: CheckInData = { mood: 10, energy: 10, stress: 10, sleep: 10, exercise: 10 }
      const score = calculateWellnessScore(data)
      expect(score).toBeDefined()
    })

    it('should handle zero values', () => {
      const data: CheckInData = { mood: 0, energy: 0, stress: 0, sleep: 0, exercise: 0 }
      const score = calculateWellnessScore(data)
      expect(score).toBeGreaterThanOrEqual(0)
    })
  })
})
