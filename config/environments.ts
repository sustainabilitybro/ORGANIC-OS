// Environment Configuration
// Centralized configuration for different deployment environments

export const environments = {
  development: {
    apiUrl: 'http://localhost:3000',
    supabaseUrl: 'http://localhost:54321',
    enableAnalytics: false,
    enableDebug: true,
    logLevel: 'debug' as const,
  },
  staging: {
    apiUrl: 'https://organic-os-staging.vercel.app',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    enableAnalytics: true,
    enableDebug: true,
    logLevel: 'info' as const,
  },
  production: {
    apiUrl: 'https://organic-os.vercel.app',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    enableAnalytics: true,
    enableDebug: false,
    logLevel: 'warn' as const,
  },
};

export type Environment = keyof typeof environments;

export function getCurrentEnvironment(): Environment {
  if (process.env.NODE_ENV === 'production') return 'production';
  if (process.env.NODE_ENV === 'staging') return 'staging';
  return 'development';
}

export const config = environments[getCurrentEnvironment()];
