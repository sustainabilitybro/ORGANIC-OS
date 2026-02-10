'use client'

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'

interface User {
  id: string
  email?: string
  name?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: { message: string } | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: { message: string } | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: { message: string } | null }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata.full_name,
        })
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata.full_name,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
  }

  const signIn = async (email: string, password: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      return { error: { message: error.message } }
    }
    return { error: null }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    if (error) {
      return { error: { message: error.message } }
    }
    return { error: null }
  }

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
  }

  const resetPassword = async (email: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) {
      return { error: { message: error.message } }
    }
    return { error: null }
  }

  return React.createElement(
    AuthContext.Provider,
    { 
      value: { 
        user, 
        loading, 
        isAuthenticated: !!user, 
        login, 
        logout, 
        signIn, 
        signUp, 
        signOut, 
        resetPassword 
      } 
    },
    children
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
