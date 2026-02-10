'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: { message: string } | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: { message: string } | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: { message: string } | null }>;
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
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project') || !supabaseUrl.includes('supabase.co')) {
      // Supabase not configured yet - use demo mode
      setLoading(false);
      return;
    }

    let supabase: any;
    try {
      const { createClient } = require('@/lib/supabase/client');
      supabase = createClient();
    } catch {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata.full_name,
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata.full_name,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || !supabaseUrl.includes('supabase.co')) {
      alert('Please configure Supabase first');
      return;
    }
    const { createClient } = require('@/lib/supabase/client');
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const logout = async () => {
    setUser(null);
  };

  const signIn = async (email: string, password: string) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || !supabaseUrl.includes('supabase.co')) {
      return { error: { message: 'Supabase not configured' } };
    }
    const { createClient } = require('@/lib/supabase/client');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: { message: error.message } };
    }
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || !supabaseUrl.includes('supabase.co')) {
      return { error: { message: 'Supabase not configured' } };
    }
    const { createClient } = require('@/lib/supabase/client');
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) {
      return { error: { message: error.message } };
    }
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || !supabaseUrl.includes('supabase.co')) {
      return { error: { message: 'Supabase not configured' } };
    }
    const { createClient } = require('@/lib/supabase/client');
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) {
      return { error: { message: error.message } };
    }
    return { error: null };
  };

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
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
