// Organic OS - Progress Tracking
// Unified Progress Across All Modules
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Card, Spinner } from '@/components/design-system';

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
  {
    id: 'identity',
    name: 'Identity',
    icon: '👤',
    color: 'emerald',
    path: '/dashboard/identity'
  },
  {
    id: 'sensory',
    name: 'Sensory',
    icon: '👁️',
    color: 'cyan',
    path: '/dashboard/sensory'
  },
  {
    id: 'emotional',
    name: 'Emotional',
    icon: '💭',
    color: 'amber',
    path: '/dashboard/emotional'
  },
  {
    id: 'wellness',
    name: 'Wellness',
    icon: '🌿',
    color: 'green',
    path: '/dashboard/wellness'
  },
  {
    id: 'recovery',
    name: 'Recovery',
    icon: '🔥',
    color: 'orange',
    path: '/dashboard/recovery'
  },
  {
    id: 'communication',
    name: 'Communication',
    icon: '🗣️',
    color: 'blue',
    path: '/dashboard/communication'
  },
  {
    id: 'atom-economy',
    name: 'Atom Economy',
    icon: '⚛️',
    color: 'purple',
    path: '/atom-economy'
  },
  {
    id: 'holistic-alchemy',
    name: 'Holistic Alchemy',
    icon: '🧪',
    color: 'rose',
    path: '/holistic-alchemy'
  }
];

// Demo progress data - would come from Supabase in production
const getDemoProgress = (): Record<string, ModuleProgress> => {
  const progress: Record<string, ModuleProgress> = {};
  
  modules.forEach(module => {
    const completed = Math.floor(Math.random() * 8);
    const total = 10;
    progress[module.id] = {
      module: module.id,
      completedItems: completed,
      totalItems: total,
      streak: Math.floor(Math.random() * 30),
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      level: Math.floor(completed / 3) + 1,
      xp: completed * 100 + Math.floor(Math.random() * 50)
    };
  });
  
  return progress;
};

export default function ProgressPage() {
  const [progress] = useState<Record<string, ModuleProgress>>(() => getDemoProgress());
  const [loading] = useState(false);
  
  const getProgressColor = (percentage: number): string => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    if (percentage >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  const getProgressWidth = (percentage: number): string => {
    return `${percentage}%`;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your journey across all modules
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const moduleProgress = progress[module.id];
            const percentage = moduleProgress 
              ? (moduleProgress.completedItems / moduleProgress.totalItems) * 100 
              : 0;
            
            return (
              <Link key={module.id} href={module.path}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{module.icon}</span>
                      <h3 className="text-lg font-semibold">{module.name}</h3>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Level {moduleProgress?.level || 1}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="font-medium">{Math.round(percentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${getProgressColor(percentage)}`}
                          style={{ width: getProgressWidth(percentage) }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {moduleProgress?.completedItems || 0} / {moduleProgress?.totalItems || 10} items
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        🔥 {moduleProgress?.streak || 0} day streak
                      </span>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {moduleProgress?.lastActive 
                            ? `Last active: ${moduleProgress.lastActive.toLocaleDateString()}`
                            : 'Not started'}
                        </span>
                        <span className="text-xs font-medium text-primary-600">
                          {moduleProgress?.xp || 0} XP
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Overall Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-primary-600">
                {Object.values(progress).reduce((sum, p) => sum + p.completedItems, 0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Items Completed</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-green-600">
                {Object.values(progress).reduce((sum, p) => sum + p.streak, 0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Streak Days</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">
                {Object.values(progress).reduce((sum, p) => sum + p.xp, 0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total XP Earned</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">
                {Object.values(progress).filter(p => p.completedItems === p.totalItems).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Modules Completed</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
