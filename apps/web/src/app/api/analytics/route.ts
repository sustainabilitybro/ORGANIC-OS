import { NextResponse } from 'next/server';

// Mock analytics data
const analyticsData = {
  overview: {
    totalUsers: 1247,
    activeToday: 89,
    totalModulesCompleted: 4521,
    averageProgress: 67
  },
  moduleEngagement: {
    identity: 78,
    emotional: 65,
    sensory: 52,
    recovery: 71,
    communication: 84,
    wellness: 61
  },
  weeklyTrend: [
    { day: 'Mon', users: 45, completions: 23 },
    { day: 'Tue', users: 52, completions: 31 },
    { day: 'Wed', users: 48, completions: 28 },
    { day: 'Thu', users: 61, completions: 35 },
    { day: 'Fri', users: 55, completions: 29 },
    { day: 'Sat', users: 38, completions: 18 },
    { day: 'Sun', users: 42, completions: 22 }
  ]
};

export async function GET() {
  return NextResponse.json(analyticsData);
}
