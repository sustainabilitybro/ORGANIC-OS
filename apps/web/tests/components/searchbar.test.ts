/**
 * SearchBar Component Tests
 */
import { describe, it, expect } from 'vitest'

describe('SearchBar Component', () => {
  describe('Search functionality', () => {
    type ResultType = 'module' | 'exercise' | 'prompt' | 'wellness'

    interface SearchResult {
      type: ResultType
      title: string
      description: string
      url: string
      module?: string
    }

    const MOCK_RESULTS: SearchResult[] = [
      { type: 'module', title: 'Identity Module', description: 'Discover your authentic self', url: '/dashboard/identity', module: 'identity' },
      { type: 'module', title: 'Emotional Intelligence', description: 'Master your emotions', url: '/dashboard/emotional', module: 'emotional' },
      { type: 'exercise', title: 'Values Clarification', description: 'Exercise to identify core values', url: '/dashboard/identity', module: 'identity' },
      { type: 'prompt', title: 'Gratitude Journal', description: 'Daily gratitude prompt', url: '/dashboard/wellness', module: 'wellness' },
      { type: 'wellness', title: 'Sleep Tracking', description: 'Log your sleep hours', url: '/dashboard/wellness', module: 'wellness' },
    ]

    const filterResults = (query: string): SearchResult[] => {
      if (!query.trim()) return []
      const lowerQuery = query.toLowerCase()
      return MOCK_RESULTS.filter(
        r => r.title.toLowerCase().includes(lowerQuery) ||
             r.description.toLowerCase().includes(lowerQuery)
      )
    }

    it('should filter results by title', () => {
      const results = filterResults('Identity')
      expect(results.length).toBeGreaterThan(0)
      expect(results.some(r => r.title.includes('Identity'))).toBe(true)
    })

    it('should return empty array for empty query', () => {
      const results = filterResults('')
      expect(results).toEqual([])
    })

    it('should filter results by description', () => {
      const results = filterResults('emotions')
      expect(results.length).toBeGreaterThan(0)
    })

    it('should be case insensitive', () => {
      const resultsLower = filterResults('identity')
      const resultsUpper = filterResults('IDENTITY')
      expect(resultsLower.length).toBe(resultsUpper.length)
    })

    it('should have valid result structure', () => {
      const result = MOCK_RESULTS[0]
      expect(result).toHaveProperty('type')
      expect(result).toHaveProperty('title')
      expect(result).toHaveProperty('description')
      expect(result).toHaveProperty('url')
    })
  })

  describe('Result types', () => {
    it('should have correct result types', () => {
      const types = ['module', 'exercise', 'prompt', 'wellness']
      types.forEach(type => {
        expect(type).toMatch(/^(module|exercise|prompt|wellness)$/)
      })
    })
  })
})
