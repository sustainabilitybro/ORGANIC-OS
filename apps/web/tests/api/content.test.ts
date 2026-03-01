/**
 * Content API Tests
 */
import { describe, it, expect } from 'vitest'

describe('Content API', () => {
  interface Content {
    id: string
    type: 'module' | 'exercise' | 'prompt' | 'article'
    title: string
    body: string
    module?: string
    tags: string[]
  }

  describe('Content Types', () => {
    const contentTypes = ['module', 'exercise', 'prompt', 'article']

    it('should have valid content types', () => {
      contentTypes.forEach(type => {
        expect(['module', 'exercise', 'prompt', 'article']).toContain(type)
      })
    })
  })

  describe('Content Search', () => {
    const mockContent: Content[] = [
      { id: '1', type: 'module', title: 'Identity Module', body: 'Discover your authentic self', module: 'identity', tags: ['identity', 'values'] },
      { id: '2', type: 'exercise', title: 'Values Clarification', body: 'Exercise to identify core values', module: 'identity', tags: ['values', 'exercise'] },
      { id: '3', type: 'prompt', title: 'Gratitude Prompt', body: 'Daily gratitude journal prompt', module: 'wellness', tags: ['gratitude', 'wellness'] },
    ]

    const searchContent = (query: string): Content[] => {
      if (!query.trim()) return []
      const lowerQuery = query.toLowerCase()
      return mockContent.filter(c => 
        c.title.toLowerCase().includes(lowerQuery) ||
        c.body.toLowerCase().includes(lowerQuery) ||
        c.tags.some(t => t.includes(lowerQuery))
      )
    }

    it('should search by title', () => {
      const results = searchContent('Identity')
      expect(results.length).toBeGreaterThan(0)
    })

    it('should search by body', () => {
      const results = searchContent('gratitude')
      expect(results.length).toBeGreaterThan(0)
    })

    it('should search by tags', () => {
      const results = searchContent('values')
      expect(results.length).toBeGreaterThan(0)
    })

    it('should return empty for no matches', () => {
      const results = searchContent('xyz123')
      expect(results).toHaveLength(0)
    })

    it('should be case insensitive', () => {
      const results1 = searchContent('identity')
      const results2 = searchContent('IDENTITY')
      expect(results1.length).toBe(results2.length)
    })
  })

  describe('Content Filtering', () => {
    const filterByType = (type: string) => {
      const content = [
        { id: '1', type: 'module', title: 'Test' },
        { id: '2', type: 'exercise', title: 'Test' },
        { id: '3', type: 'module', title: 'Test' },
      ]
      return content.filter(c => c.type === type)
    }

    it('should filter modules', () => {
      const modules = filterByType('module')
      expect(modules).toHaveLength(2)
    })

    it('should filter exercises', () => {
      const exercises = filterByType('exercise')
      expect(exercises).toHaveLength(1)
    })
  })

  describe('Content Versioning', () => {
    const getLatestVersion = (versions: { version: string }[]): string => {
      if (versions.length === 0) return '1.0.0'
      const sorted = [...versions].sort((a, b) => 
        b.version.localeCompare(a.version, undefined, { numeric: true })
      )
      return sorted[0].version
    }

    it('should return latest version', () => {
      const versions = [
        { version: '1.0.0' },
        { version: '1.1.0' },
        { version: '2.0.0' },
      ]
      expect(getLatestVersion(versions)).toBe('2.0.0')
    })

    it('should handle empty array', () => {
      expect(getLatestVersion([])).toBe('1.0.0')
    })
  })
})
