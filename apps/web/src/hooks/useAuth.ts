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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
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

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, isAuthenticated: !!user, login, logout } },
    children
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
