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
    setLoading(false);
  }, []);

  const login = async () => {};
  const logout = async () => {
    setUser(null);
  };
  const signIn = async (email: string, password: string) => {
    return { error: null };
  };
  const signUp = async (email: string, password: string, fullName: string) => {
    return { error: null };
  };
  const signOut = async () => {
    setUser(null);
  };
  const resetPassword = async (email: string) => {
    return { error: null };
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, isAuthenticated: !!user, login, logout, signIn, signUp, signOut, resetPassword } },
    children
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
