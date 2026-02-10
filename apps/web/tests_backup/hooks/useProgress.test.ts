// useProgress hook tests
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useProgress } from '../src/hooks/useProgress'
import { createMockSupabaseClient } from './utils'

// Mock Supabase
vi.mock('../src/lib/supabase/client', () => ({
  createClient: () => createMockSupabaseClient(),
}))

describe('useProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return initial state correctly', () => {
    const { result } = renderHook(() => useProgress('test-user-id'))
    
    expect(result.current.progress).toEqual({})
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('should fetch module progress', async () => {
    const mockProgress = {
      'identity': { progress_percentage: 50, module_name: 'identity' },
      'wellness': { progress_percentage: 75, module_name: 'wellness' },
    }
    
    const mockSupabase = createMockSupabaseClient()
    const mockQuery = {
      eq: vi.fn().mockResolvedValue({ data: mockProgress, error: null }),
    }
    mockSupabase.from.mockReturnValue(mockQuery)
    
    const { result } = renderHook(() => useProgress('test-user-id'))
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it('should update module progress', async () => {
    const mockSupabase = createMockSupabaseClient()
    const mockQuery = {
      upsert: vi.fn().mockResolvedValue({ data: { id: '1' }, error: null }),
    }
    mockSupabase.from.mockReturnValue(mockQuery)
    
    const { result } = renderHook(() => useProgress('test-user-id'))
    
    // Test update function
    await waitFor(async () => {
      const updateResult = await result.current.updateModuleProgress('identity', 60)
      expect(updateResult).toBeDefined()
    })
  })
})
