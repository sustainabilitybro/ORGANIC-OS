// useAuth hook tests
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAuth } from '../src/hooks/useAuth'
import { createMockSupabaseClient, mockUser, mockSession } from './utils'

// Mock Supabase
vi.mock('../src/lib/supabase/client', () => ({
  createClient: () => createMockSupabaseClient(),
}))

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return initial state correctly', () => {
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('should sign in user successfully', async () => {
    const mockSupabase = createMockSupabaseClient()
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    })
    
    const { result } = renderHook(() => useAuth())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it('should handle sign in error', async () => {
    const mockSupabase = createMockSupabaseClient()
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' },
    })
    
    const { result } = renderHook(() => useAuth())
    
    await waitFor(() => {
      expect(result.current.error).toBe('Invalid credentials')
    })
  })
})
