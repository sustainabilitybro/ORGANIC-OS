'use client';

import { useState, useEffect } from 'react';

interface WellnessEntry {
  id: string;
  date: string;
  mood_score?: number;
  energy_level?: number;
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
  level: number;
  xp: number;
}

// Mock data for when API is unavailable
const MOCK_PROGRESS: ProgressData = {
  streak: 5,
  weeklyProgress: 45,
  goalsCompleted: 12,
  meditationMinutes: 180,
  level: 3,
  xp: 1250,
};

const MOCK_ENTRIES: WellnessEntry[] = [
  { id: '1', date: '2024-01-15', mood_score: 7, energy_level: 6, sleep_hours: 7.5 },
  { id: '2', date: '2024-01-16', mood_score: 8, energy_level: 7, sleep_hours: 8 },
  { id: '3', date: '2024-01-17', mood_score: 6, energy_level: 5, sleep_hours: 6 },
];

export function useProgress(userId: string | null = null) {
  const [loading, setLoading] = useState(false);
  const [wellnessEntries, setWellnessEntries] = useState<WellnessEntry[]>([]);
  const [progress, setProgress] = useState<ProgressData>(MOCK_PROGRESS);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId) {
        // Use mock data when not authenticated
        setWellnessEntries(MOCK_ENTRIES);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Try to fetch from API
        const res = await fetch(`/api/mood_entries?module=mood_entries`);
        if (res.ok) {
          const data = await res.json();
          if (data.data) {
            setWellnessEntries(data.data);
          }
        }
      } catch (error) {
        console.log('Using mock data for progress');
        setWellnessEntries(MOCK_ENTRIES);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  const trackActivity = async (activity: string, data?: any) => {
    if (!userId) return;
    
    try {
      await fetch('/api/mood_entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: 'mood_entries',
          data: {
            user_id: userId,
            mood_score: data?.mood || null,
            journal_entry: activity,
          },
        }),
      });
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  const getStreak = () => progress.streak;

  return {
    progress,
    setProgress: () => {},
    loading,
    wellnessEntries,
    moduleProgress: {},
    trackActivity,
    getStreak,
  };
}
