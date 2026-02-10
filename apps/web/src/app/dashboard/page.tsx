// Dashboard Page

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/design-system';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
  const { progress, loading: progressLoading } = useProgress(user?.id || null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || progressLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Welcome back{user ? `, ${user.name || 'User'}` : ''}! 👋
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Ready to continue your growth journey today?
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Current Streak"
            value={`${progress.streak || 0} days`}
            icon="🔥"
          />
          <StatCard
            title="Weekly Progress"
            value={`${progress.weeklyProgress || 0}%`}
            icon="📈"
          />
          <StatCard
            title="Goals Completed"
            value={progress.goalsCompleted || 0}
            icon="✅"
          />
          <StatCard
            title="Time Meditated"
            value={`${progress.meditationMinutes || 0}m`}
            icon="🧘"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Check-in</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              How are you feeling today?
            </p>
            <div className="flex gap-2">
              {['😊', '🙂', '😐', '😔', '😢'].map((mood, i) => (
                <button
                  key={i}
                  className="text-2xl hover:scale-110 transition-transform"
                  aria-label={`Rate mood ${i + 1}`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Daily Focus</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Your recommended activity for today
            </p>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
              <p className="font-medium text-emerald-800 dark:text-emerald-200">
                🌅 Morning Meditation
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-300 mt-1">
                Start your day with 10 minutes of mindfulness
              </p>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <ActivityItem
              icon="📝"
              title="Mood Logged"
              description="You logged your mood as Good"
              time="2 hours ago"
            />
            <ActivityItem
              icon="🧘"
              title="Meditation Complete"
              description="15 minutes of guided meditation"
              time="5 hours ago"
            />
            <ActivityItem
              icon="✅"
              title="Habit Completed"
              description="Morning workout routine finished"
              time="Yesterday"
            />
          </div>
        </Card>
      </main>
    </div>
  );
}

// Loading skeleton
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-8 w-64 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-4 w-96 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </main>
    </div>
  );
}

// Stats card
interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </Card>
  );
}

// Activity item
interface ActivityItemProps {
  icon: string;
  title: string;
  description: string;
  time: string;
}

function ActivityItem({ icon, title, description, time }: ActivityItemProps) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
      <span className="text-sm text-neutral-400">{time}</span>
    </div>
  );
}
