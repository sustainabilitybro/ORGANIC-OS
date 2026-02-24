'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'

interface User {
  id: string
  email?: string
  name?: string
  avatar_url?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  isConfigured: boolean
  login: (email: string, password: string) => Promise<{ error: Error | null }>
  logout: () => Promise<void>
  signOut: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updateProfile: (data: Partial<User>) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  isConfigured: false,
  login: async () => ({ error: null }),
  logout: async () => {},
  signOut: async () => {},
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  updateProfile: async () => ({ error: null }),
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    // Check if Supabase is configured
    const checkConfig = async () => {
      try {
        const { isSupabaseConfigured } = await import('@organic-os/database')
        const configured = isSupabaseConfigured()
        setIsConfigured(configured)
        
        if (configured) {
          // Initialize auth state from Supabase
          const { getSupabase } = await import('@organic-os/database')
          const supabase = await getSupabase()
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || undefined,
              name: session.user.user_metadata?.full_name,
              avatar_url: session.user.user_metadata?.avatar_url
            })
          }
        }
      } catch (error) {
        console.warn('Supabase not configured, using mock auth')
        setIsConfigured(false)
      } finally {
        setLoading(false)
      }
    }

    checkConfig()
  }, [])

  const login = async (email: string, password: string) => {
    if (!isConfigured) {
      return { error: new Error('Supabase is not configured. Please set up environment variables.') }
    }
    try {
      const { getSupabase } = await import('@organic-os/database')
      const supabase = await getSupabase()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error }
    } catch (error: any) {
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    return login(email, password)
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!isConfigured) {
      return { error: new Error('Supabase is not configured. Please set up environment variables.') }
    }
    try {
      const { getSupabase } = await import('@organic-os/database')
      const supabase = await getSupabase()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      return { error }
    } catch (error: any) {
      return { error }
    }
  }

  const logout = async () => {
    if (!isConfigured) {
      setUser(null)
      return
    }
    try {
      const { getSupabase } = await import('@organic-os/database')
      const supabase = await getSupabase()
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
    setUser(null)
  }

  const signOut = async () => {
    await logout()
  }

  const resetPassword = async (email: string) => {
    if (!isConfigured) {
      return { error: new Error('Supabase is not configured. Please set up environment variables.') }
    }
    try {
      const { getSupabase } = await import('@organic-os/database')
      const supabase = await getSupabase()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`
      })
      return { error }
    } catch (error: any) {
      return { error }
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!isConfigured || !user) {
      return { error: new Error('Not authenticated') }
    }
    
    try {
      const { getSupabase } = await import('@organic-os/database')
      const supabase = await getSupabase()
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          ...data
        })
      
      if (!error) {
        setUser(prev => prev ? { ...prev, ...data } : null)
      }
      
      return { error }
    } catch (error: any) {
      return { error }
    }
  }

  return React.createElement(
    AuthContext.Provider,
    { 
      value: { 
        user, 
        loading, 
        isAuthenticated: !!user,
        isConfigured,
        login, 
        logout, 
        signOut, 
        signIn, 
        signUp, 
        resetPassword,
        updateProfile
      } 
    },
    children
  )
}

export function useAuth() {
  return React.useContext(AuthContext)
}
