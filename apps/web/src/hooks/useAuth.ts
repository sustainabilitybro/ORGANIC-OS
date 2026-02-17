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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  signIn: async () => {},
  signUp: async () => {},
  resetPassword: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {};
  const logout = async () => {
    setUser(null);
  };
  const signIn = async (email: string, password: string) => {};
  const signUp = async (email: string, password: string, fullName?: string) => {};
  const resetPassword = async (email: string) => {};

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, isAuthenticated: !!user, login, logout, signIn, signUp, resetPassword } },
    children
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
