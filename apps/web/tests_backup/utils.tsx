// Test utilities and mocks
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, Mock } from 'vitest'

// Mock Supabase client
export const createMockSupabaseClient = () => ({
  auth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    refreshSession: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    order: vi.fn().mockResolvedValue({ data: [], error: null }),
  })),
})

// Mock user for testing
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
    avatar_url: 'https://example.com/avatar.png',
  },
}

// Mock session for testing
export const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  user: mockUser,
}

// Helper to render with providers
export const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui)
}

// Helper to simulate user input
export const simulateInput = (name: string, value: string) => {
  const input = screen.getByRole('textbox', { name }) || screen.getByLabelText(name)
  fireEvent.change(input, { target: { value } })
}

// Helper to click button
export const clickButton = (name: string) => {
  const button = screen.getByRole('button', { name })
  fireEvent.click(button)
}

// Helper to wait for async operations
export const waitForAsync = (ms = 100) => waitFor(() => new Promise(r => setTimeout(r, ms)))
