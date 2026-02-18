// Common TypeScript types

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
}

export interface ModuleProgress {
  moduleId: string;
  progress: number;
  completedTopics: number;
  totalTopics: number;
  lastActivity: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  earnedAt?: Date;
}

export interface StreakData {
  current: number;
  longest: number;
  lastActive: string;
}

export interface AnalyticsData {
  totalUsers: number;
  activeToday: number;
  totalModulesCompleted: number;
  averageProgress: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type ModuleColor = 'emerald' | 'cyan' | 'green' | 'lime' | 'amber' | 'purple' | 'violet' | 'blue' | 'rose';

export interface ModuleInfo {
  id: string;
  name: string;
  icon: string;
  color: ModuleColor;
}
