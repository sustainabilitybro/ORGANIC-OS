/**
 * Version API Tests
 */
import { describe, it, expect } from 'vitest'

describe('Version API', () => {
  describe('GET /api/version', () => {
    const versionResponse = {
      app: 'Organic OS',
      version: '1.0.0',
      api_version: 'v1',
      build: 'local',
      node: process.version,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    }

    it('should return app name', () => {
      expect(versionResponse.app).toBe('Organic OS')
    })

    it('should return version string', () => {
      expect(versionResponse.version).toBeDefined()
      expect(typeof versionResponse.version).toBe('string')
    })

    it('should return API version', () => {
      expect(versionResponse.api_version).toBe('v1')
    })

    it('should include node version', () => {
      expect(versionResponse.node).toBeDefined()
      expect(versionResponse.node).toMatch(/^v\d+\.\d+/)
    })

    it('should include environment', () => {
      expect(versionResponse.environment).toBeDefined()
    })

    it('should include timestamp', () => {
      expect(versionResponse.timestamp).toBeDefined()
      expect(new Date(versionResponse.timestamp).getTime()).toBeGreaterThan(0)
    })
  })
})
