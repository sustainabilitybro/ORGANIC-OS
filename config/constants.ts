// Application Constants
// Centralized constants for Organic OS

// App Info
export const APP_NAME = 'Organic OS';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'The Operating System for Being Human';

// API
export const API_VERSION = 'v1';
export const API_TIMEOUT = 30000;
export const CACHE_DURATION = 3600;

// GitHub
export const GITHUB_USER = 'sustainabilitybro';
export const GITHUB_API_BASE = 'https://api.github.com';

// Feature Flags
export const FEATURES = {
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_AI_CHAT: process.env.NEXT_PUBLIC_ENABLE_AI_CHAT === 'true',
  ENABLE_PWA: true,
  ENABLE_RSS: true,
};

// Module IDs
export const MODULES = {
  IDENTITY: 'identity',
  EMOTIONAL: 'emotional',
  SENSORY: 'sensory',
  WELLNESS: 'wellness',
  RECOVERY: 'recovery',
  COMMUNICATION: 'communication',
  VIDEO: 'video',
  SUSTAINABILITY: 'sustainability',
  HOLISTIC_ALCHEMY: 'holistic-alchemy',
  ATOM_ECONOMY: 'atom-economy',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  AUTH: '/auth',
  SETTINGS: '/settings',
  PROGRESS: '/progress',
  ANALYTICS: '/analytics',
  GITHUB: '/github',
} as const;

// Colors (theme)
export const THEME = {
  PRIMARY: '#6B7F3B',
  SECONDARY: '#45a6b8',
  SUCCESS: '#28a745',
  WARNING: '#ffc107',
  DANGER: '#dc3545',
  NEUTRAL: '#3A3226',
  BACKGROUND: '#FAF8F5',
} as const;
