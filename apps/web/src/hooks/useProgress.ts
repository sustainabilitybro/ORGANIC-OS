'use client';

import { useState, useMemo } from 'react';

// Types matching what analytics expects
interface WellnessEntry {
  id: string;
  date: string;
  mood?: number;
  mood_score?: number;
  energy?: number;
  sleep?: number;
  sleep_hours?: number;
}

interface ModuleProgress {
  id: string;
  module_name: string;
  progress_percentage: number;
  last_activity: string;
  completed_topics: string[];
}

interface ProgressData {
  streak: number;
  weeklyProgress: number;
  goalsCompleted: number;
  meditationMinutes: number;
  [key: string]: any;
}

export function useProgress(userId: string | null = null) {
  const [loading] = useState(false);
  
  const wellnessEntries: WellnessEntry[] = useMemo(() => {
    // Return mock data for demo
    return [
      { id: '1', date: '2024-01-15', mood: 7, energy: 6, sleep: 7.5 },
      { id: '2', date: '2024-01-16', mood: 8, energy: 7, sleep: 8 },
    ];
  }, []);
  
  const moduleProgress: Record<string, ModuleProgress> = useMemo(() => {
    return {
      identity: {
        id: '1',
        module_name: 'Identity',
        progress_percentage: 75,
        last_activity: '2024-01-15',
        completed_topics: ['values', 'ikigai'],
      },
      wellness: {
        id: '2',
        module_name: 'Wellness',
        progress_percentage: 100,
        last_activity: '2024-01-10',
        completed_topics: ['sleep', 'nutrition', 'exercise'],
      },
    };
  }, []);
  
  const progress: ProgressData = useMemo(() => ({
    streak: 5,
    weeklyProgress: 75,
    goalsCompleted: 12,
    meditationMinutes: 45,
  }), []);
  
  return {
    progress,
    setProgress: () => {},
    loading,
    wellnessEntries,
    moduleProgress,
    trackActivity: () => {},
    getStreak: () => 5,
  };
}
