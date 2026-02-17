// Dashboard Page - Enhanced with GitHub Integration

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/design-system';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/hooks/useAuth';

interface GitHubRepo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  updated_at: string;
}

interface DashboardStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;;
  streak: number;
  weeklyProgress: number;
  goalsCompleted: number;
  meditationMinutes: number;
}

export default function DashboardPage() {
  const { progress, loading: progressLoading } = useProgress();
  const { user, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [githubStats, setGithubStats] = useState<DashboardStats>({
    totalRepos: 0,
    totalStars: 0,
    totalForks: 0,
    streak: 0,
    weeklyProgress: 0,
    goalsCompleted: 0,
    meditationMinutes: 0
  });

  useEffect(() => {
    setMounted(true);
    // Simulated GitHub stats (would come from GitHub API in production)
    setGithubStats(prev => ({
      ...prev,
      totalRepos: 8,
      totalStars: 47,
      totalForks: 12
    }));
  }, []);

  if (!mounted || authLoading || progressLoading) {
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
            value={`${githubStats.streak || progress.streak || 0} days`}
            icon="🔥"
            color="orange"
          />
          <StatCard
            title="Weekly Progress"
            value={`${githubStats.weeklyProgress || progress.weeklyProgress || 0}%`}
            icon="📈"
            color="blue"
          />
          <StatCard
            title="Goals Completed"
            value={githubStats.goalsCompleted || progress.goalsCompleted || 0}
            icon="✅"
            color="green"
          />
          <StatCard
            title="GitHub Stars"
            value={githubStats.totalStars}
            icon="⭐"
            color="yellow"
          />
        </div>

        {/* GitHub Integration Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">GitHub Repositories</h2>
              <a 
                href="https://github.com/sustainabilitybro?tab=repositories" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View All →
              </a>
            </div>
            <div className="space-y-3">
              <GitHubRepoItem
                name="ORGANIC-OS"
                description="The Operating System for Being Human"
                stars={47}
                forks={12}
                language="TypeScript"
              />
              <GitHubRepoItem
                name="atom-economy"
                description="Optimizing resource efficiency calculations"
                stars={12}
                forks={3}
                language="Python"
              />
              <GitHubRepoItem
                name="holistic-alchemy"
                description="Wellness integration module"
                stars={8}
                forks={2}
                language="TypeScript"
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 dark:text-neutral-400">Total Repos</span>
                <span className="font-semibold">{githubStats.totalRepos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 dark:text-neutral-400">Total Stars</span>
                <span className="font-semibold text-yellow-500">{githubStats.totalStars}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 dark:text-neutral-400">Total Forks</span>
                <span className="font-semibold text-blue-500">{githubStats.totalForks}</span>
              </div>
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <p className="text-sm text-neutral-500">
                  Last synced: Just now
                </p>
              </div>
            </div>
          </Card>
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
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
              <p className="font-medium text-primary-800 dark:text-primary-200">
                🌅 Morning Meditation
              </p>
              <p className="text-sm text-primary-600 dark:text-primary-300 mt-1">
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
              description="You logged your mood as 'Good'"
              time="2 hours ago"
            />
            <ActivityItem
              icon="💻"
              title="Code Pushed"
              description="Committed to ORGANIC-OS repository"
              time="4 hours ago"
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
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
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

// GitHub Repository Item
interface GitHubRepoItemProps {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
}

function GitHubRepoItem({ name, description, stars, forks, language }: GitHubRepoItemProps) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
      <div className="flex-1">
        <a 
          href={`https://github.com/sustainabilitybro/${name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary-600 hover:text-primary-700"
        >
          {name}
        </a>
        <p className="text-sm text-neutral-500 mt-1">{description}</p>
        <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            {language}
          </span>
          <span className="flex items-center gap-1">
            ⭐ {stars}
          </span>
          <span className="flex items-center gap-1">
            🍴 {forks}
          </span>
        </div>
      </div>
    </div>
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
