// Application constants

export const APP_NAME = 'Organic OS';
export const APP_VERSION = '1.0.0';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const MODULES = [
  { id: 'identity', name: 'Identity', icon: '👤', color: 'emerald' },
  { id: 'sensory', name: 'Sensory', icon: '👁️', color: 'cyan' },
  { id: 'emotional', name: 'Emotional', icon: '💚', color: 'green' },
  { id: 'wellness', name: 'Wellness', icon: '🌿', color: 'lime' },
  { id: 'recovery', name: 'Recovery', icon: '🔋', color: 'amber' },
  { id: 'communication', name: 'Communication', icon: '🎤', color: 'purple' },
  { id: 'sustainability', name: 'Sustainability', icon: '🌱', color: 'emerald' },
  { id: 'holistic-alchemy', name: 'Holistic Alchemy', icon: '🧪', color: 'violet' },
  { id: 'atom-economy', name: 'Atom Economy', icon: '⚛️', color: 'blue' },
  { id: 'video', name: 'Video', icon: '📹', color: 'rose' },
] as const;

export const STREAK_THRESHOLDS = [
  { days: 7, badge: 'Week Warrior' },
  { days: 30, badge: 'Monthly Master' },
  { days: 100, badge: 'Century Club' },
  { days: 365, badge: 'Year Champion' },
];

export const API_ENDPOINTS = {
  health: '/api/health',
  analytics: '/api/analytics',
  progress: '/api/progress',
  stats: '/api/stats',
  repos: '/api/github/repos',
};

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  LAST_MODULE: 'last_module',
  THEME: 'theme',
  NOTIFICATIONS: 'notifications',
};
