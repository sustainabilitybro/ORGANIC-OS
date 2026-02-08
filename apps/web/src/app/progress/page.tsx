// Organic OS - Progress Tracking
// Unified Progress Across All Modules

'use client';

import { useState } from 'react';

interface ModuleProgress {
  module: string;
  completedItems: number;
  totalItems: number;
  streak: number;
  lastActive: Date;
  level: number;
  xp: number;
}

const modules = [
  { id: 'identity', name: 'Identity', icon: '👤', color: 'emerald' },
  { id: 'sensory', name: 'Sensory', icon: '👁️', color: 'cyan' },
  { id: 'emotional', name: 'Emotional', icon: '💚', color: 'green' },
  { id: 'wellness', name: 'Wellness', icon: '🌿', color: 'lime' },
  { id: 'recovery', name: 'Recovery', icon: '🔋', color: 'amber' },
  { id: 'communication', name: 'Communication', icon: '🎤', color: 'purple' },
  { id: 'video', name: 'Video', icon: '📹', color: 'rose' },
];

export default function ProgressPage() {
  const [progress, setProgress] = useState<ModuleProgress[]>([
    { module: 'identity', completedItems: 8, totalItems: 20, streak: 3, lastActive: new Date(), level: 2, xp: 450 },
    { module: 'emotional', completedItems: 15, totalItems: 30, streak: 7, lastActive: new Date(), level: 4, xp: 1200 },
    { module: 'wellness', completedItems: 5, totalItems: 25, streak: 2, lastActive: new Date(), level: 1, xp: 200 },
    { module: 'recovery', completedItems: 12, totalItems: 20, streak: 5, lastActive: new Date(), level: 3, xp: 850 },
    { module: 'communication', completedItems: 3, totalItems: 25, streak: 0, lastActive: new Date(), level: 1, xp: 150 },
  ]);

  const overallXP = progress.reduce((sum, p) => sum + p.xp, 0);
  const overallLevel = Math.floor(overallXP / 500) + 1;
  const totalCompleted = progress.reduce((sum, p) => sum + p.completedItems, 0);
  const totalItemssum, p) = progress.reduce(( => sum + p.totalItems, 0);
  const overallStreak = Math.max(...progress.map(p => p.streak));

  const getColorClass = (color: string) => ({
    emerald: 'bg-emerald-500',
    cyan: 'bg-cyan-500',
    green: 'bg-green-500',
    lime: 'bg-lime-500',
    amber: 'bg-amber-500',
    purple: 'bg-purple-500',
    rose: 'bg-rose-500',
  })[color];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📊</span>
            <div>
              <h1 className="text-2xl font-bold">Progress Tracking</h1>
              <p className="text-sm text-neutral-400">Your holistic development journey</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <span className="text-2xl mb-2 block">⭐</span>
            <p className="text-3xl font-bold">{overallLevel}</p>
            <p className="text-sm text-neutral-400">Overall Level</p>
            <div className="mt-2 h-2 bg-neutral-800 rounded-full">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" style={{ width: `${(overallXP % 500) / 5}%` }} />
            </div>
            <p className="text-xs text-neutral-500 mt-1">{overallXP} / {overallLevel * 500} XP</p>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <span className="text-2xl mb-2 block">📈</span>
            <p className="text-3xl font-bold">{totalCompleted}/{totalItems}</p>
            <p className="text-sm text-neutral-400">Items Completed</p>
            <p className="text-sm text-emerald-400 mt-2">
              {Math.round((totalCompleted / totalItems) * 100)}% overall
            </p>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <span className="text-2xl mb-2 block">🔥</span>
            <p className="text-3xl font-bold">{overallStreak}</p>
            <p className="text-sm text-neutral-400">Day Streak</p>
            <p className="text-sm text-amber-400 mt-2">Keep it going!</p>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <span className="text-2xl mb-2 block">🎯</span>
            <p className="text-3xl font-bold">{modules.length}</p>
            <p className="text-sm text-neutral-400">Active Modules</p>
            <p className="text-sm text-cyan-400 mt-2">All systems go</p>
          </div>
        </div>

        {/* Module Progress Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Module Progress</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map(mod => {
              const modProgress = progress.find(p => p.module === mod.id) || {
                completedItems: 0,
                totalItems: 10,
                streak: 0,
                level: 1,
                xp: 0,
              };
              const percent = Math.round((modProgress.completedItems / modProgress.totalItems) * 100);

              return (
                <Link
                  key={mod.id}
                  href={`/${mod.id}`}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{mod.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium">{mod.name}</h3>
                      <p className="text-xs text-neutral-400">Level {modProgress.level}</p>
                    </div>
                    <span className={`w-3 h-3 rounded-full ${getColorClass(mod.color)}`} />
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full">
                      <div
                        className={`h-full ${getColorClass(mod.color)} rounded-full transition-all`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>{modProgress.completedItems}/{modProgress.totalItems} items</span>
                    <span>{modProgress.streak} day streak</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { icon: '🌟', name: 'First Steps', desc: 'Complete first exercise', earned: true },
              { icon: '🔥', name: 'On Fire', desc: '7-day streak', earned: true },
              { icon: '💚', name: 'Heart Opener', desc: 'Log 10 emotions', earned: true },
              { icon: '🎯', name: 'Sharp Shooter', desc: 'Perfect practice session', earned: true },
              { icon: '🌱', name: 'Growth Mindset', desc: 'Reach level 5', earned: false },
              { icon: '🏆', name: 'Master', desc: 'Complete all modules', earned: false },
              { icon: '💪', name: 'Resilient', desc: '30-day recovery streak', earned: false },
              { icon: '🎤', name: 'Confident Speaker', desc: 'Record 10 videos', earned: false },
            ].map((achievement, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border ${
                  achievement.earned
                    ? 'bg-neutral-900 border-neutral-700'
                    : 'bg-neutral-900/50 border-neutral-800 opacity-50'
                }`}
              >
                <span className="text-2xl block mb-1">{achievement.icon}</span>
                <p className="font-medium text-sm">{achievement.name}</p>
                <p className="text-xs text-neutral-400">{achievement.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="space-y-4">
              {[
                { time: 'Today', icon: '💚', text: 'Logged emotion: Grateful', module: 'Emotional' },
                { time: 'Today', icon: '🌿', text: 'Added Ashwagandha to protocol', module: 'Wellness' },
                { time: 'Yesterday', icon: '🔋', text: 'Completed stress assessment', module: 'Recovery' },
                { time: '2 days ago', icon: '🎯', text: 'Set new speaking goal', module: 'Communication' },
                { time: '3 days ago', icon: '👤', text: 'Updated core values', module: 'Identity' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 pb-4 border-b border-neutral-800 last:border-0 last:pb-0">
                  <span className="text-xl">{activity.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm">{activity.text}</p>
                    <p className="text-xs text-neutral-400">{activity.module}</p>
                  </div>
                  <span className="text-xs text-neutral-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
