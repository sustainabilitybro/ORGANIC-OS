// Dark Mode Theme Hook with System Preference Detection

import { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';

// ============ Types ============

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  systemPreference: 'light' | 'dark';
  isDark: boolean;
}

// ============ Storage Key ============

const THEME_STORAGE_KEY = 'organic-os-theme';
const COLOR_MODE_KEY = 'color-mode';

// ============ System Preference Detection ============

function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light';
}

// ============ Local Storage ============

function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored as Theme;
    }
  } catch {}
  
  return null;
}

function setStoredTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
}

// ============ Resolve Theme ============

function resolveTheme(theme: Theme, systemPreference: 'light' | 'dark'): 'light' | 'dark' {
  if (theme === 'system') {
    return systemPreference;
  }
  return theme;
}

// ============ Apply Theme to Document ============

function applyTheme(resolvedTheme: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  if (resolvedTheme === 'dark') {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
  }
}

// ============ Theme Context ============

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ 
  children,
  defaultTheme = 'system'
}: { 
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  
  // Initialize theme
  useEffect(() => {
    setMounted(true);
    
    // Get system preference
    const systemPref = getSystemPreference();
    setSystemPreference(systemPref);
    
    // Get stored theme or use default
    const stored = getStoredTheme();
    const initialTheme = stored || defaultTheme;
    setThemeState(initialTheme);
    
    // Resolve and apply theme
    const resolved = resolveTheme(initialTheme, systemPref);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, [defaultTheme]);
  
  // Listen for system preference changes
  useEffect(() => {
    if (!mounted) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemPref = e.matches ? 'dark' : 'light';
      setSystemPreference(newSystemPref);
      
      // If using system theme, update resolved theme
      if (theme === 'system') {
        const resolved = resolveTheme(theme, newSystemPref);
        setResolvedTheme(resolved);
        applyTheme(resolved);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);
  
  // Set theme with storage
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    setStoredTheme(newTheme);
    
    const resolved = resolveTheme(newTheme, systemPreference);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, [systemPreference]);
  
  // Toggle theme
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);
  
  // Computed values
  const isDark = resolvedTheme === 'dark';
  
  const value = useMemo(() => ({
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    systemPreference,
    isDark
  }), [theme, resolvedTheme, setTheme, toggleTheme, systemPreference, isDark]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ============ useTheme Hook ============

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// ============ Simplified Hooks ============

export function useResolvedTheme(): 'light' | 'dark' {
  const { resolvedTheme } = useTheme();
  return resolvedTheme;
}

export function useIsDark(): boolean {
  const { isDark } = useTheme();
  return isDark;
}

export function useThemeSetter(): (theme: Theme) => void {
  const { setTheme } = useTheme();
  return setTheme;
}

// ============ Theme-aware Color Hook ============

export function useThemeColor<T>(
  lightColor: T,
  darkColor: T
): T {
  const isDark = useIsDark();
  return isDark ? darkColor : lightColor;
}

// ============ Theme-aware Opacity ============

export function useThemeOpacity(
  lightOpacity: number,
  darkOpacity: number
): number {
  const isDark = useIsDark();
  return isDark ? darkOpacity : lightOpacity;
}

// ============ Theme Transition ============

export function useThemeTransition(): boolean {
  const { theme } = useTheme();
  return theme !== 'system';
}

// ============ Theme Persistence ============

export function useThemeSync(): {
  syncToStorage: () => void;
  resetToDefault: () => void;
} {
  const { theme, setTheme } = useTheme();
  
  const syncToStorage = useCallback(() => {
    setStoredTheme(theme);
  }, [theme]);
  
  const resetToDefault = useCallback(() => {
    setTheme('system');
  }, [setTheme]);
  
  return { syncToStorage, resetToDefault };
}

// ============ Multiple Theme Colors ============

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
}

export function useThemeColors(): ThemeColors {
  const isDark = useIsDark();
  
  return useMemo(() => {
    if (isDark) {
      return {
        background: '#0f0f0f',
        surface: '#1a1a1a',
        text: '#f5f5f5',
        textSecondary: '#a3a3a3',
        border: '#333333',
        accent: '#22c55e'
      };
    }
    return {
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#171717',
      textSecondary: '#737373',
      border: '#e5e5e5',
      accent: '#16a34a'
    };
  }, [isDark]);
}

// ============ Theme-aware CSS Variables ============

export function useCSSVariables(): Record<string, string> {
  const isDark = useIsDark();
  
  return useMemo(() => {
    if (isDark) {
      return {
        '--color-bg-primary': '#0f0f0f',
        '--color-bg-secondary': '#1a1a1a',
        '--color-bg-tertiary': '#262626',
        '--color-text-primary': '#f5f5f5',
        '--color-text-secondary': '#a3a3a3',
        '--color-border': '#333333',
        '--color-accent': '#22c55e',
        '--color-accent-hover': '#16a34a',
        '--color-danger': '#ef4444',
        '--color-warning': '#f59e0b',
        '--color-success': '#22c55e',
        '--shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.3)',
        '--shadow-md': '0 4px 6px rgba(0, 0, 0, 0.4)',
        '--shadow-lg': '0 10px 15px rgba(0, 0, 0, 0.5)'
      };
    }
    return {
      '--color-bg-primary': '#ffffff',
      '--color-bg-secondary': '#f5f5f5',
      '--color-bg-tertiary': '#e5e5e5',
      '--color-text-primary': '#171717',
      '--color-text-secondary': '#737373',
      '--color-border': '#e5e5e5',
      '--color-accent': '#16a34a',
      '--color-accent-hover': '#15803d',
      '--color-danger': '#dc2626',
      '--color-warning': '#d97706',
      '--color-success': '#16a34a',
      '--shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
      '--shadow-md': '0 4px 6px rgba(0, 0, 0, 0.1)',
      '--shadow-lg': '0 10px 15px rgba(0, 0, 0, 0.1)'
    };
  }, [isDark]);
}

// ============ Flash Prevention ============

export function usePreventThemeFlash(): void {
  useEffect(() => {
    // Apply theme immediately to prevent flash
    const systemPref = getSystemPreference();
    const stored = getStoredTheme();
    const theme = stored || 'system';
    const resolved = resolveTheme(theme, systemPref);
    applyTheme(resolved);
  }, []);
}

// ============ Export ============

export type { ThemeContextType };
