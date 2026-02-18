import { NextResponse } from 'next/server';

// Mock user progress data
const mockProgress = {
  modules: {
    identity: { progress: 85, completedTopics: 12, totalTopics: 14 },
    emotional: { progress: 72, completedTopics: 18, totalTopics: 25 },
    sensory: { progress: 45, completedTopics: 9, totalTopics: 20 },
    recovery: { progress: 90, completedTopics: 27, totalTopics: 30 },
    communication: { progress: 68, completedTopics: 15, totalTopics: 22 },
    wellness: { progress: 55, completedTopics: 11, totalTopics: 20 }
  },
  streak: {
    current: 7,
    longest: 14,
    lastActive: new Date().toISOString().split('T')[0]
  },
  achievements: [
    { id: 'first_login', name: 'First Steps', earned: true },
    { id: 'week_streak', name: 'Week Warrior', earned: true },
    { id: 'module_complete', name: 'Module Master', earned: false }
  ]
};

export async function GET() {
  return NextResponse.json(mockProgress);
}
